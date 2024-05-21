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

const SprintsDashboard = ({ sprints, issues }: Props) => {
    const { projectId } = useParams();
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
    const [sprintTasksCompleted, setSprintTasksCompleted] = useState<number>(0);
    const [sprintTasksPlanned, setSprintTasksPlanned] = useState<number>(0);
    const [sprintTasksStatuses, setSprintTasksStatuses] = useState<
        {
            id: number;
            value: number;
            label: string;
        }[]
    >([]);
    const [burnDownChartInfo, setBurnDownChartInfo] = useState<
        {
            label: string;
            value: number | null;
            trend: number;
        }[]
    >([]);

    function getDatesArray(startDate: Date, endDate: Date): Date[] {
        const daysArray: Date[] = [];
        const currentDate = new Date(startDate);
        while (
            currentDate.setHours(0, 0, 0, 0) <= endDate.setHours(0, 0, 0, 0)
        ) {
            daysArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return daysArray;
    }

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
            setSprintTasksCompleted(
                sprintIssues.filter((issue) => issue.status.is_closed).length
            );
            setSprintTasksPlanned(sprintIssues.length);
            const sprintTasksStatuses = sprintIssues.reduce(
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
            );
            setSprintTasksStatuses(Object.values(sprintTasksStatuses));

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
                    <div className="mt-5">
                        <FormControl>
                            <InputLabel id="select-sprint">Sprint</InputLabel>
                            <Select
                                labelId="select-sprint"
                                value={selectedSprint?.id || ""}
                                label="Sprint"
                                onChange={handleSprintChange}
                            >
                                {sprints &&
                                    sprints.map((sprint: Sprint) => (
                                        <MenuItem
                                            key={sprint.id}
                                            value={sprint.id}
                                        >
                                            {sprint.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                    {sprintTasksPlanned > 0 && (
                        <div>
                            <div className="mt-5 flex gap-5">
                                <div>
                                    <PieChartCard
                                        title="Tasks by status"
                                        data={sprintTasksStatuses}
                                    />
                                </div>
                                <div>
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
                                    />
                                </div>
                            </div>
                            <div className="flex mt-5 gap-5">
                                <BurnDownChartCard
                                    title="Burn Down Chart"
                                    data={burnDownChartInfo}
                                />
                            </div>
                        </div>
                    )}
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
                    <div className="flex justify-center items-center">
                        <p className="text-gray-500">
                            No sprints found for this project
                        </p>
                    </div>
                ))}
        </div>
    );
};

export default SprintsDashboard;
