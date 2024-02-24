import { useParams } from "react-router-dom";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getReleases } from "../../../api/services/releasesService";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { useEffect, useState } from "react";
import { Timeline } from "../../../components/Pages/Dashboard/Timeline";
import { ComparativeCard } from "../../../components/Pages/Dashboard/ComparativeCard";
import { PieChartCard } from "../../../components/Pages/Dashboard/PieChartCard";
import { getIssues } from "../../../api/services/issuesService";
import { Issue, IssueFilter } from "../../../api/models/issue";
import { BurnUpChartCard } from "../../../components/Pages/Dashboard/BurnUpChartCard";
import { getSprints } from "../../../api/services/sprintsService";
import { Sprint, SprintFilter } from "../../../api/models/sprint";
import { ESTIMATIONS_TO_POINTS } from "../../../utilities/constants";

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 500,
};

const defaultIssueFilters: IssueFilter = {
    page: 1,
    limit: 500,
};

const defaultSprintFilters: SprintFilter = {
    page: 1,
    limit: 500,
};

const Dashboard = () => {
    const { projectId } = useParams();
    const [releases, setReleases] = useState<Release[]>();
    const [issues, setIssues] = useState<Issue[]>();
    const [tasksCompleted, setTasksCompleted] = useState<number>(0);
    const [tasksPlanned, setTasksPlanned] = useState<number>(0);
    const [tasksStatuses, setTasksStatuses] = useState<
        {
            id: number;
            value: number;
            label: string;
        }[]
    >([]);
    const [sprintsToBurnUp, setSprintsToBurnUp] = useState<any>(null);

    const getAllReleasesForProject = async () => {
        if (projectId) {
            const { data } = await getReleases({
                ...defaultFilters,
                projectId: +projectId,
            });
            return data.items;
        }
    };

    const getAllSprintsForProject = async () => {
        if (projectId) {
            const { data } = await getSprints({
                ...defaultSprintFilters,
                projectId: +projectId,
            });
            return data.items;
        }
    };

    const getAllIssuesForProject = async () => {
        if (projectId) {
            const { data } = await getIssues({
                ...defaultIssueFilters,
                projectId: +projectId,
            });
            return data.items;
        }
    };

    const calculateBurnUp = (sprints: Sprint[], issues: Issue[]) => {
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
                    console.log(
                        issueEstimation,
                        orderedSprints[sprintIndex].label,
                        issue.subject
                    );
                    orderedSprints[sprintIndex].trend += issueEstimation;
                    if (issue.status.is_closed) {
                        orderedSprints[sprintIndex].completed +=
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

        cumulativeOrderedSprints.unshift({
            label: "",
            completed: 0,
            trend: 0,
        });

        setSprintsToBurnUp(cumulativeOrderedSprints);
    };

    const setUpDashboardsData = async () => {
        let releases = await getAllReleasesForProject();
        if (releases) {
            setReleases(releases);
        }
        let issues = await getAllIssuesForProject();
        if (issues) {
            setIssues(issues);
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

            const sprints = await getAllSprintsForProject();
            if (sprints) {
                calculateBurnUp(sprints, issues);
            }
        }
    };

    useEffect(() => {
        setUpDashboardsData();
    }, [projectId]);

    return (
        <Sidebar>
            <Page>
                <div className="flex justify-between items-center">
                    <PageTitle title="Dashboard" />
                </div>
                {releases && releases.length > 1 && (
                    <div className="mt-5">
                        <Timeline releases={releases || []} />
                    </div>
                )}
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
                                { name: "Completed", value: tasksCompleted },
                                { name: "Planned", value: tasksPlanned },
                            ]}
                        />
                    </div>
                </div>
                <div className="mt-5 flex gap-5">
                    <BurnUpChartCard
                        title="Burn Up Chart"
                        data={sprintsToBurnUp}
                    />
                </div>
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
