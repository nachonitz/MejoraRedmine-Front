import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProjectMembers } from "../../../components/Pages/Settings/Members/ProjectMembers";
import { ProjectInfo } from "../../../components/Pages/Settings/ProjectInfo";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";

const Settings = () => {
    const { projectId } = useParams();
    const [value, setValue] = useState("1");

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Sidebar>
            <Page>
                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Settings" />
                </div>
                <Box
                    sx={{
                        width: "100%",
                        typography: "body1",
                        marginTop: "20px",
                    }}
                >
                    {projectId && (
                        <TabContext value={value}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <TabList
                                    onChange={handleChange}
                                    aria-label="lab API tabs example"
                                >
                                    <Tab
                                        label="Project Information"
                                        value="1"
                                    />
                                    <Tab label="Members" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <ProjectInfo projectId={projectId} />
                            </TabPanel>
                            <TabPanel value="2">
                                <ProjectMembers projectId={+projectId} />
                            </TabPanel>
                        </TabContext>
                    )}
                </Box>
            </Page>
        </Sidebar>
    );
};

export default Settings;
