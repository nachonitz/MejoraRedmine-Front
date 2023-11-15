import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import AdminSidebar from "../../components/Shared/AdminSidebar/AdminSidebar";
import Page from "../../components/Shared/Page/Page";
import PageTitle from "../../components/Shared/Page/PageTitle/PageTitle";
import PrimaryButton from "../../components/Shared/Buttons/PrimaryButton";
import { LoadingIcon } from "../../components/Shared/Loading/LoadingIcon";
import { useState } from "react";

const Users = () => {
    const [title, setTitle] = useState("");
    const [path, setPath] = useState("");
    const [protocol, setProtocol] = useState("");

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorPath, setErrorPath] = useState(false);
    const [errorProtocol, setErrorProtocol] = useState(false);

    const [isLoading, setLoading] = useState<boolean>(false);

    return (
        <AdminSidebar>
            <Page>
                <PageTitle title="Users" />
                <div className="mt-[30px]">
                    <span>Users</span>
                </div>
            </Page>
        </AdminSidebar>
    );
};

export default Users;
