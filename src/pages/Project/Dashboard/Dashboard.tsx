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

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 500,
};

const Dashboard = () => {
    const { projectId } = useParams();
    const [releases, setReleases] = useState<Release[]>();

    const getAllReleasesForProject = async () => {
        if (projectId) {
            const { data } = await getReleases({
                ...defaultFilters,
                projectId: +projectId,
            });
            setReleases(data.items);
        }
    };

    useEffect(() => {
        getAllReleasesForProject();
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
                        <ComparativeCard
                            title="Tasks"
                            properties={[
                                { name: "Completed", value: "31" },
                                { name: "Planned", value: "214" },
                            ]}
                        />
                    </div>
                    <div>
                        <PieChartCard
                            title="Tasks by status"
                            data={[
                                { id: 1, value: 31, label: "Completed" },
                                { id: 2, value: 214, label: "Planned" },
                            ]}
                        />
                    </div>
                </div>
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
