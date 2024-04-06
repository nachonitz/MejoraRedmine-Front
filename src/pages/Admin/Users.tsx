import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    TextField,
} from "@mui/material";
import AdminSidebar from "../../components/Shared/AdminSidebar/AdminSidebar";
import Page from "../../components/Shared/Page/Page";
import PageTitle from "../../components/Shared/Page/PageTitle/PageTitle";
import PrimaryButton from "../../components/Shared/Buttons/PrimaryButton";
import { LoadingIcon } from "../../components/Shared/Loading/LoadingIcon";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RedmineUsers } from "../../components/Pages/Admin/Users/RedmineUsers";

const Users = () => {
    const [pending, setPending] = useState(12);
    const [value, setValue] = useState("1");

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <AdminSidebar>
            <Page>
                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Users" />
                </div>
                <Box
                    sx={{
                        width: "100%",
                        typography: "body1",
                        marginTop: "20px",
                    }}
                >
                    <TabContext value={value}>
                        <Box
                            sx={{
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                            >
                                <Tab label="Users" value="1" />
                                <Tab
                                    icon={
                                        pending > 0 ? (
                                            <div
                                                className={`${
                                                    pending > 99
                                                        ? "w-[32px] h-[32px]"
                                                        : "w-[26px] h-[26px]"
                                                } bg-red-500 rounded-full text-white text-[12px] flex justify-center items-center`}
                                            >
                                                {pending > 99 ? "99+" : pending}
                                            </div>
                                        ) : undefined
                                    }
                                    iconPosition="end"
                                    label="Pending"
                                    value="2"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <RedmineUsers />
                        </TabPanel>
                        <TabPanel value="2">
                            <RedmineUsers />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Page>
        </AdminSidebar>
    );
};

export default Users;
