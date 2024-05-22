import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, LinearProgress, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Issue, IssueFilter } from "../../../api/models/issue";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { Sprint, SprintFilter } from "../../../api/models/sprint";
import { getIssues } from "../../../api/services/issuesService";
import { getReleases } from "../../../api/services/releasesService";
import { getSprints } from "../../../api/services/sprintsService";
import ProjectDashboard from "../../../components/Pages/Dashboard/ProjectDashboard";
import SprintsDashboard from "../../../components/Pages/Dashboard/SprintsDashboard";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 500,
};

const defaultIssueFilters: IssueFilter = {
    page: 1,
    limit: 10000,
};

const defaultSprintFilters: SprintFilter = {
    page: 1,
    limit: 500,
};

const Dashboard = () => {
    const { projectId } = useParams();
    const [releases, setReleases] = useState<Release[]>();
    const [sprints, setSprints] = useState<Sprint[]>();
    const [issues, setIssues] = useState<Issue[]>();
    const [dashboardView, setDashboardView] = useState("1");
    const [loading, setLoading] = useState(true);

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

    const setUpDashboardsData = async () => {
        setLoading(true);
        const releases = await getAllReleasesForProject();
        if (releases) {
            setReleases(releases);
        }
        const issues = await getAllIssuesForProject();
        if (issues) {
            setIssues(issues);
        }
        const sprints = await getAllSprintsForProject();
        if (sprints) {
            setSprints(sprints);
        }
        setLoading(false);
    };

    useEffect(() => {
        setUpDashboardsData();
    }, [projectId]);

    const handleChangeDashboardView = (
        _event: React.SyntheticEvent,
        newValue: string
    ) => {
        setDashboardView(newValue);
    };

    return (
        <Sidebar>
            <Page>
                <div className="flex justify-between items-center">
                    <PageTitle title="Dashboard" />
                </div>
                <div className="mt-2">
                    <TabContext value={dashboardView}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList onChange={handleChangeDashboardView}>
                                <Tab label="Project" value="1" />
                                <Tab label="Sprints" value="2" />
                            </TabList>
                        </Box>
                        {loading && (
                            <>
                                <div className="mt-10">
                                    <LinearProgress />
                                </div>
                            </>
                        )}
                        {!loading && (
                            <div className="bg-[#f1f7fd]">
                                <TabPanel value="1">
                                    {releases && sprints && issues && (
                                        <ProjectDashboard
                                            releases={releases}
                                            sprints={sprints}
                                            issues={issues}
                                        />
                                    )}
                                </TabPanel>
                                <TabPanel value="2">
                                    {releases && sprints && issues && (
                                        <SprintsDashboard
                                            releases={releases}
                                            sprints={sprints}
                                            issues={issues}
                                        />
                                    )}
                                </TabPanel>
                            </div>
                        )}
                    </TabContext>
                </div>
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
