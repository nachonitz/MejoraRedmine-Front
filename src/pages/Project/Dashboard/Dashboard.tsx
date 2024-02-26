import { useParams } from "react-router-dom";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getReleases } from "../../../api/services/releasesService";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { useEffect, useState } from "react";
import { getIssues } from "../../../api/services/issuesService";
import { Issue, IssueFilter } from "../../../api/models/issue";
import { getSprints } from "../../../api/services/sprintsService";
import { Sprint, SprintFilter } from "../../../api/models/sprint";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import ProjectDashboard from "../../../components/Pages/Dashboard/ProjectDashboard";
import SprintsDashboard from "../../../components/Pages/Dashboard/SprintsDashboard";

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
    const [sprints, setSprints] = useState<Sprint[]>();
    const [issues, setIssues] = useState<Issue[]>();
    const [dashboardView, setDashboardView] = useState("1");

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
        let releases = await getAllReleasesForProject();
        if (releases) {
            setReleases(releases);
        }
        let issues = await getAllIssuesForProject();
        if (issues) {
            setIssues(issues);
        }
        const sprints = await getAllSprintsForProject();
        if (sprints) {
            setSprints(sprints);
        }
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
                <div className="mt-[20px]">
                    <TabContext value={dashboardView}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList onChange={handleChangeDashboardView}>
                                <Tab label="Project" value="1" />
                                <Tab label="Sprints" value="2" />
                            </TabList>
                        </Box>
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
                    </TabContext>
                </div>
            </Page>
        </Sidebar>
    );
};

export default Dashboard;
