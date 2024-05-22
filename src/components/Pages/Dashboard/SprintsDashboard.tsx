import { useParams } from "react-router-dom";
import { Release } from "../../../api/models/release";
import { useEffect, useState } from "react";
import { ComparativeCard } from "./ComparativeCard";
import { PieChartCard } from "./PieChartCard";
import { Issue } from "../../../api/models/issue";
import { Sprint } from "../../../api/models/sprint";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ESTIMATIONS_TO_POINTS } from "../../../utilities/constants";
import { BurnDownChartCard } from "./BurnDownChartCard";
import { getShortDate } from "../../../lib/utils";

interface Props {
    releases: Release[];
    sprints: Sprint[];
    issues: Issue[];
}

function getDatesArray(startDate: Date, endDate: Date): Date[] {
    const daysArray: Date[] = [];
    const currentDate = new Date(startDate);
    while (currentDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)) {
        daysArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return daysArray;
}

const SprintsDashboard = ({ sprints, issues }: Props) => {
    const { projectId } = useParams();
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
    const [burnDownChartInfo, setBurnDownChartInfo] = useState<
        {
            label: string;
            value: number | null;
            trend: number;
        }[]
    >([]);

    const sprintIssues = issues.filter(
        (issue) => issue.sprint?.id === (selectedSprint?.id || 0)
    );
    const sprintTasksPlanned = sprintIssues.length;
    const sprintTasksCompleted = sprintIssues.filter(
        (issue) => issue.status.is_closed
    ).length;
    const bugsCompleted = sprintIssues.filter(
        (issue) => issue.tracker.name === "Bug" && issue.status.is_closed
    ).length;
    const bugsPlanned = sprintIssues.filter(
        (issue) => issue.tracker.name === "Bug"
    ).length;
    const featuresCompleted = sprintIssues.filter(
        (issue) => issue.tracker.name === "Feature" && issue.status.is_closed
    ).length;
    const featuresPlanned = sprintIssues.filter(
        (issue) => issue.tracker.name === "Feature"
    ).length;
    const supportIssuesCompleted = sprintIssues.filter(
        (issue) => issue.tracker.name === "Support" && issue.status.is_closed
    ).length;
    const supportIssuesPlanned = sprintIssues.filter(
        (issue) => issue.tracker.name === "Support"
    ).length;
    const sprintTasksStatuses = Object.values(
        sprintIssues.reduce(
            (
                acc: {
                    [key: number]: {
                        id: number;
                        value: number;
                        label: string;
                    };
                },
                issue
            ) => {
                if (!acc[issue.status.id]) {
                    acc[issue.status.id] = {
                        id: issue.status.id,
                        value: 0,
                        label: issue.status.name,
                    };
                }
                acc[issue.status.id].value++;
                return acc;
            },
            {}
        )
    );

    const setUpDashboardsData = async () => {
        let currentSprint = sprints.find((sprint) => {
            const sprintEndDate = new Date(sprint.endDate);
            const today = new Date();
            const sprintStartDate = new Date(sprint.startDate);
            return sprintEndDate >= today && sprintStartDate <= today;
        });
        if (!currentSprint) {
            currentSprint = sprints.find((sprint) => {
                const sprintEndDate = new Date(sprint.endDate);
                const today = new Date();
                return sprintEndDate < today;
            });
        }
        setSelectedSprint(currentSprint || null);
        if (currentSprint) {
            setupSprintCharts(currentSprint, issues || []);
        }
    };

    useEffect(() => {
        setUpDashboardsData();
    }, [projectId]);

    const handleSprintChange = (e: any) => {
        const sprint = sprints?.find((sprint) => sprint.id === e.target.value);
        if (sprint) {
            setupSprintCharts(sprint, issues || []);
            setSelectedSprint(sprint);
        }
    };

    const setupSprintCharts = (sprint: Sprint, issues: Issue[]) => {
        if (sprint && issues) {
            const sprintIssues = issues.filter(
                (issue) => issue.sprint?.id === sprint.id
            );

            const datesArray = getDatesArray(
                new Date(sprint.startDate),
                new Date(sprint.endDate)
            );

            const totalStoryPoints = issues
                .filter((i) => i.sprint?.id === sprint.id)
                .reduce((acc, issue) => {
                    const issueEstimation = issue.estimation
                        ? ESTIMATIONS_TO_POINTS[
                              issue.estimation as keyof typeof ESTIMATIONS_TO_POINTS
                          ] ?? 0
                        : 0;
                    return acc + issueEstimation;
                }, 0);

            const totalDays = datesArray.length;

            let days: {
                date: Date;
                label: string;
                value: number | null;
                trend: number;
            }[] = datesArray.map((date, i) => {
                return {
                    date: date,
                    label: getShortDate(date),
                    value: 0,
                    trend:
                        totalStoryPoints -
                        (totalStoryPoints / totalDays) * (i + 1),
                };
            });

            for (const issue of sprintIssues) {
                const issueEstimation = issue.estimation
                    ? ESTIMATIONS_TO_POINTS[
                          issue.estimation as keyof typeof ESTIMATIONS_TO_POINTS
                      ] ?? 0
                    : 0;
                if (
                    issue.status.is_closed &&
                    issue.endDate &&
                    new Date(issue.endDate).setHours(0, 0, 0, 0) <=
                        new Date(sprint.endDate).setHours(0, 0, 0, 0)
                ) {
                    const issueClosedDate = new Date(issue.endDate);
                    let issueClosedDateIndex = datesArray.findIndex(
                        (date) =>
                            date.toDateString() ===
                            issueClosedDate.toDateString()
                    );
                    if (issueClosedDateIndex !== -1) {
                        if (issueClosedDateIndex > 0) {
                            issueClosedDateIndex--;
                            for (let i = issueClosedDateIndex; i >= 0; i--) {
                                if (days[i].value !== null) {
                                    days[i].value =
                                        (days[i].value || 0) + issueEstimation;
                                }
                            }
                        }
                    }
                } else {
                    days.map((day) => {
                        if (day.value !== null) {
                            day.value += issueEstimation;
                        }
                        return day;
                    });
                }
            }

            // Value null for future days
            const today = new Date();
            days = days.map(
                (day: {
                    date: Date;
                    label: string;
                    value: number | null;
                    trend: number;
                }) => {
                    if (day.date && day.date > today) {
                        return {
                            ...day,
                            value: null,
                        };
                    }
                    return day;
                }
            );

            const burnDownChartInformation = days.map((day, _i) => {
                return {
                    label: day.label,
                    value: day.value,
                    trend: day.trend,
                };
            });

            if (burnDownChartInformation.length > 0) {
                burnDownChartInformation.unshift({
                    label: "",
                    value: totalStoryPoints,
                    trend: totalStoryPoints,
                });
                setBurnDownChartInfo(burnDownChartInformation);
            }
        }
    };

    return (
        <div>
            {sprints && sprints.length > 0 && (
                <div>
                    <FormControl>
                        <InputLabel id="select-sprint">Sprint</InputLabel>
                        <Select
                            labelId="select-sprint"
                            value={selectedSprint?.id || ""}
                            label="Sprint"
                            onChange={handleSprintChange}
                            className="bg-white"
                        >
                            {sprints &&
                                sprints.map((sprint: Sprint) => (
                                    <MenuItem key={sprint.id} value={sprint.id}>
                                        {sprint.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    {sprintTasksPlanned > 0 && (
                        <div>
                            <div className="flex mt-5 gap-5">
                                <PieChartCard
                                    title="Tasks by status"
                                    data={sprintTasksStatuses}
                                />
                                <BurnDownChartCard
                                    title="Burn Down Chart"
                                    data={burnDownChartInfo}
                                />
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-4 gap-5 w-full mt-5">
                        <ComparativeCard
                            title="Tasks"
                            properties={[
                                {
                                    name: "Completed",
                                    value: sprintTasksCompleted,
                                },
                                {
                                    name: "Planned",
                                    value: sprintTasksPlanned,
                                },
                            ]}
                            color="#004A8E"
                        />
                        <ComparativeCard
                            title="Bugs"
                            properties={[
                                {
                                    name: "Completed",
                                    value: bugsCompleted,
                                },
                                {
                                    name: "Total",
                                    value: bugsPlanned,
                                },
                            ]}
                            color="#FE3406"
                            icon="/assets/icons/bug-icon.png"
                        />
                        <ComparativeCard
                            title="Features"
                            properties={[
                                {
                                    name: "Completed",
                                    value: featuresCompleted,
                                },
                                {
                                    name: "Total",
                                    value: featuresPlanned,
                                },
                            ]}
                            color="#F98D50"
                            icon="/assets/icons/user-story-icon.png"
                        />
                        <ComparativeCard
                            title="Support Issues"
                            properties={[
                                {
                                    name: "Completed",
                                    value: supportIssuesCompleted,
                                },
                                {
                                    name: "Total",
                                    value: supportIssuesPlanned,
                                },
                            ]}
                            color="#7F7F7F"
                            icon="/assets/icons/support-icon.png"
                        />
                    </div>
                    {sprintTasksPlanned === 0 && (
                        <div className="mt-5">
                            <div className="flex justify-center items-center">
                                <p className="text-gray-500">
                                    No tasks planned for this sprint
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {!sprints ||
                (sprints.length === 0 && (
                    <div className="flex justify-center items-center min-h-[450px]">
                        <p className="text-gray-500">
                            No sprints found for this project
                        </p>
                    </div>
                ))}
        </div>
    );
};

export default SprintsDashboard;
