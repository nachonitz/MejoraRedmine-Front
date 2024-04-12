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
import { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { RedmineUsers } from "../../components/Pages/Admin/Users/RedmineUsers";
import { Pending } from "../../components/Pages/Admin/Pending/Pending";
import { getPendingUsers, getUsers } from "../../api/services/usersService";
import { PendingUser, User, UserFilter } from "../../api/models/user";
import { UsersContext } from "../../context/UsersContext";

const defaultFilters: UserFilter = {
    page: 1,
    limit: 10,
};

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [value, setValue] = useState("1");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const getAllUsers = async (userFilters: UserFilter) => {
        setIsLoading(true);
        const { data } = await getUsers(userFilters);
        setIsLoading(false);
        setUsers(data.items);
    };

    const getAllPendingUsers = async () => {
        setIsLoading(true);
        const { data } = await getPendingUsers();
        setPendingUsers(data);
        setPendingCount(data.length);
        setIsLoading(false);
    };

    useEffect(() => {
        getAllPendingUsers();
        getAllUsers(defaultFilters);
    }, []);

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
                    <UsersContext.Provider
                        value={{
                            users,
                            getUsers: getAllUsers,
                            pendingUsers,
                            pendingUsersCount: pendingCount,
                            getPendingUsers: getAllPendingUsers,
                            isLoading,
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
                                            pendingCount > 0 ? (
                                                <div
                                                    className={`${
                                                        pendingCount > 99
                                                            ? "w-[32px] h-[32px]"
                                                            : "w-[26px] h-[26px]"
                                                    } bg-red-500 rounded-full text-white text-[12px] flex justify-center items-center`}
                                                >
                                                    {pendingCount > 99
                                                        ? "99+"
                                                        : pendingCount}
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
                                <Pending />
                            </TabPanel>
                        </TabContext>
                    </UsersContext.Provider>
                </Box>
            </Page>
        </AdminSidebar>
    );
};

export default Users;
