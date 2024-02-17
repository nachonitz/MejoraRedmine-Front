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

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 500,
};

const defaultIssueFilters: IssueFilter = {
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

    const getAllReleasesForProject = async () => {
        if (projectId) {
            const { data } = await getReleases({
                ...defaultFilters,
                projectId: +projectId,
            });
            setReleases(data.items);
        }
    };

    const getAllIssuesForProject = async () => {
        if (projectId) {
            const { data } = await getIssues({
                ...defaultIssueFilters,
                projectId: +projectId,
            });
            setIssues(data.items);
            setTasksCompleted(
                data.items.filter((issue) => issue.status.is_closed).length
            );
            setTasksPlanned(data.items.length);
            let tasksStatuses = data.items.reduce(
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
            console.log(tasksStatuses);
            setTasksStatuses(Object.values(tasksStatuses));
        }
    };

    useEffect(() => {
        getAllReleasesForProject();
        getAllIssuesForProject();
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
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
