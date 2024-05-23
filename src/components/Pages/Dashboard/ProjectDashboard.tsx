import { useParams } from "react-router-dom";
import { Release } from "../../../api/models/release";
import { useEffect, useState } from "react";
import { Timeline } from "./Timeline";
import { ComparativeCard } from "./ComparativeCard";
import { PieChartCard } from "./PieChartCard";
import { Issue } from "../../../api/models/issue";
import { BurnUpChartCard } from "./BurnUpChartCard";
import { Sprint } from "../../../api/models/sprint";
import { ESTIMATIONS_TO_POINTS } from "../../../utilities/constants";
import { SprintsVelocityChartCard } from "./SprintsVelocityChartCard";

interface Props {
    releases: Release[];
    sprints: Sprint[];
    issues: Issue[];
}

const ProjectDashboard = ({ releases, sprints, issues }: Props) => {
    const { projectId } = useParams();
    const [sprintsToBurnUp, setSprintsToBurnUp] = useState<
        { label: string; completed: number | null; trend: number }[]
    >([]);
    const [sprintsVelocity, setSprintsVelocity] = useState<
        { label: string; velocity: number }[]
    >([]);

    const tasksStatuses = Object.values(
        issues.reduce(
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

    const tasksCompleted = issues.filter(
        (issue) => issue.status.is_closed
    ).length;
    const tasksPlanned = issues.length;
    const bugsCompleted = issues.filter(
        (issue) => issue.tracker.name === "Bug" && issue.status.is_closed
    ).length;
    const bugsPlanned = issues.filter(
        (issue) => issue.tracker.name === "Bug"
    ).length;
    const featuresCompleted = issues.filter(
        (issue) => issue.tracker.name === "Feature" && issue.status.is_closed
    ).length;
    const featuresPlanned = issues.filter(
        (issue) => issue.tracker.name === "Feature"
    ).length;
    const supportIssuesCompleted = issues.filter(
        (issue) => issue.tracker.name === "Support" && issue.status.is_closed
    ).length;
    const supportIssuesPlanned = issues.filter(
        (issue) => issue.tracker.name === "Support"
    ).length;

    const calculateSprintCharts = (sprints: Sprint[], issues: Issue[]) => {
        let orderedSprints = sprints
            .sort(
                (a: Sprint, b: Sprint) =>
                    new Date(a.endDate).getTime() -
                    new Date(b.endDate).getTime()
            )
            .map((sprint: Sprint) => {
                return {
                    id: sprint.id,
                    label: sprint.name,
                    completed: 0,
                    trend: 0,
                    isFuture:
                        new Date(sprint.endDate).getTime() >
                        new Date().getTime(),
                };
            });

        let totalStoryPoints = 0;
        for (let issue of issues) {
            totalStoryPoints += issue.estimation
                ? ESTIMATIONS_TO_POINTS[
                      issue.estimation as keyof typeof ESTIMATIONS_TO_POINTS
                  ] ?? 0
                : 0;
            if (issue.sprint) {
                let sprintIndex = orderedSprints.findIndex(
                    (sprint) => sprint.id === issue.sprint?.id
                );
                if (sprintIndex !== -1) {
                    let issueEstimation = issue.estimation
                        ? ESTIMATIONS_TO_POINTS[
                              issue.estimation as keyof typeof ESTIMATIONS_TO_POINTS
                          ] ?? 0
                        : 0;
                    orderedSprints[sprintIndex].trend += issueEstimation;

                    if (issue.status.is_closed) {
                        // get the sprint where the issue was closed
                        let closedSprintIndex;
                        if (issue.endDate) {
                            let issueEndDate = new Date(issue.endDate).setHours(
                                0,
                                0,
                                0,
                                0
                            );

                            closedSprintIndex = sprints.findIndex((sprint) => {
                                return (
                                    new Date(sprint.startDate).setHours(
                                        0,
                                        0,
                                        0,
                                        0
                                    ) <= issueEndDate &&
                                    new Date(sprint.endDate).setHours(
                                        0,
                                        0,
                                        0,
                                        0
                                    ) >= issueEndDate
                                );
                            });
                        } else {
                            closedSprintIndex = sprintIndex;
                        }

                        orderedSprints[closedSprintIndex].completed +=
                            issueEstimation;
                    }
                }
            }
        }

        const totalSprints = orderedSprints.length;

        let cumulativeOrderedSprints = orderedSprints.map((sprint, index) => {
            let trend: number = 0;
            let completed: number | null = 0;
            for (let i = 0; i <= index; i++) {
                completed += orderedSprints[i].completed;
            }
            trend = (totalStoryPoints / totalSprints) * (index + 1);

            if (sprint.isFuture) {
                completed = null;
            }
            return {
                label: sprint.label,
                completed: completed,
                trend: trend,
            };
        });

        if (cumulativeOrderedSprints.length > 0) {
            cumulativeOrderedSprints.unshift({
                label: "",
                completed: 0,
                trend: 0,
            });
            setSprintsToBurnUp(cumulativeOrderedSprints);
        }

        let sprintsVelocity = orderedSprints.map((sprint) => {
            return {
                label: sprint.label,
                velocity: sprint.trend,
            };
        });
        setSprintsVelocity(sprintsVelocity);
    };

    const setUpDashboardsData = async () => {
        calculateSprintCharts(sprints, issues);
    };

    const isEmptyData = () => {
        return (
            tasksPlanned === 0 &&
            releases?.length === 0 &&
            sprintsToBurnUp.length === 0 &&
            sprintsVelocity.length === 0
        );
    };

    useEffect(() => {
        setUpDashboardsData();
    }, [projectId]);

    return (
        <div>
            {!isEmptyData() && (
                <div>
                    {releases && releases.length > 1 && (
                        <Timeline releases={releases} />
                    )}
                    <div className="mt-5 flex gap-5">
                        <BurnUpChartCard
                            title="Burn Up Chart"
                            data={sprintsToBurnUp}
                            condition={
                                sprintsToBurnUp && sprintsToBurnUp.length > 0
                            }
                        />
                        <SprintsVelocityChartCard
                            title="Sprints Velocity"
                            data={sprintsVelocity}
                            condition={
                                sprintsVelocity && sprintsVelocity.length > 0
                            }
                        />
                    </div>
                    <div className="mt-5 flex gap-5">
                        <PieChartCard
                            title="Tasks by status"
                            data={tasksStatuses}
                            className="w-3/5"
                        />
                        <div className="grid grid-cols-2 gap-5 w-2/5">
                            <ComparativeCard
                                title="Tasks"
                                properties={[
                                    {
                                        name: "Completed",
                                        value: tasksCompleted,
                                    },
                                    {
                                        name: "Planned",
                                        value: tasksPlanned,
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
                    </div>
                </div>
            )}

            {isEmptyData() && (
                <div className="flex justify-center items-center">
                    <p className="text-gray-500">There is no data to display</p>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
