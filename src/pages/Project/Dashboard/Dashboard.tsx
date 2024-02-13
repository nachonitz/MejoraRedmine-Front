import { useParams } from "react-router-dom";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getReleases } from "../../../api/services/releasesService";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { useEffect, useState } from "react";

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
                <div></div>
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
