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
    const [tasksCompleted, setTasksCompleted] = useState<number>(0);
    const [tasksPlanned, setTasksPlanned] = useState<number>(0);
    const [tasksStatuses, setTasksStatuses] = useState<
        {
            id: number;
            value: number;
            label: string;
        }[]
    >([]);
    const [sprintsToBurnUp, setSprintsToBurnUp] = useState<
        { label: string; completed: number | null; trend: number }[]
    >([]);
    const [sprintsVelocity, setSprintsVelocity] = useState<
        { label: string; velocity: number }[]
    >([]);

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

        for (let issue of issues) {
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

        let cumulativeOrderedSprints = orderedSprints.map((sprint, index) => {
            let trend: number = 0;
            let completed: number | null = 0;
            for (let i = 0; i <= index; i++) {
                trend += orderedSprints[i].trend;
                completed += orderedSprints[i].completed;
            }

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
        setTasksCompleted(
            issues.filter((issue) => issue.status.is_closed).length
        );
        setTasksPlanned(issues.length);
        let tasksStatuses = issues.reduce(
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
        setTasksStatuses(Object.values(tasksStatuses));
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
                        <div className="mt-5">
                            <Timeline releases={releases} />
                        </div>
                    )}
                    {tasksPlanned > 0 && (
                        <div className="mt-5 flex gap-5">
                            <div>
                                <PieChartCard
                                    title="Tasks by status"
                                    data={tasksStatuses}
                                />
                            </div>

                            <div>
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
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-5 flex gap-5">
                        {sprintsToBurnUp && sprintsToBurnUp.length > 0 && (
                            <BurnUpChartCard
                                title="Burn Up Chart"
                                data={sprintsToBurnUp}
                            />
                        )}
                        {sprintsVelocity && sprintsVelocity.length > 0 && (
                            <SprintsVelocityChartCard
                                title="Sprints Velocity"
                                data={sprintsVelocity}
                            />
                        )}
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
