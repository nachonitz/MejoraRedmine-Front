import { TextField } from "@mui/material";
import AdminSidebar from "../../components/Shared/AdminSidebar/AdminSidebar";
import Page from "../../components/Shared/Page/Page";
import PageTitle from "../../components/Shared/Page/PageTitle/PageTitle";
import PrimaryButton from "../../components/Shared/Buttons/PrimaryButton";
import { LoadingIcon } from "../../components/Shared/Loading/LoadingIcon";
import { useContext, useEffect, useState } from "react";
import {
    getAppInfo,
    updateAppInfo,
} from "../../api/services/applicationService";
import { errorToast, successToast } from "../../components/Shared/Toast";
import { AppInfoContext } from "../../context/AppInfoContext";

const Information = () => {
    const { getAppInfo: getApplicationInformation } =
        useContext(AppInfoContext);
    const [title, setTitle] = useState("");
    const [welcome, setWelcome] = useState("");

    const [errorTitle, setErrorTitle] = useState(false);
    const [errorWelcome, setErrorWelcome] = useState(false);

    const [isLoading, setLoading] = useState<boolean>(false);

    const checkErrors = () => {
        let errors = false;
        if (!title) {
            setErrorTitle(true);
            errors = true;
        }
        if (!welcome) {
            setErrorWelcome(true);
            errors = true;
        }
        return errors;
    };

    const updateApplicationInfo = async () => {
        let errors = checkErrors();
        if (errors) return;
        setErrorTitle(false);
        setErrorWelcome(false);
        setLoading(true);
        try {
            await updateAppInfo({ app_title: title, welcome_text: welcome });
            await getApplicationInformation();
            successToast("Settings updated successfully");
        } catch (error: any) {
            console.log(error);
            errorToast("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getApplicationInfo = async () => {
        const info = await getAppInfo();
        setTitle(info.app_title);
        setWelcome(info.welcome_text);
    };

    useEffect(() => {
        getApplicationInfo();
    }, []);

    return (
        <AdminSidebar>
            <Page>
                <PageTitle title="Settings" />
                <div className="mt-[30px]">
                    <div className="w-full mt-4 flex flex-col gap-5">
                        <div className="flex flex-col gap-[20px]">
                            <TextField
                                onChange={(e) => setTitle(e.target.value)}
                                error={errorTitle}
                                value={title}
                                className="w-full"
                                id="title"
                                label="App Title"
                                variant="outlined"
                            />
                            <TextField
                                onChange={(e) => setWelcome(e.target.value)}
                                error={errorWelcome}
                                value={welcome}
                                className="w-full"
                                id="welcome"
                                label="Welcome Text"
                                variant="outlined"
                            />
                        </div>
                        <div>
                            <PrimaryButton onClick={updateApplicationInfo}>
                                {isLoading ? <LoadingIcon /> : "Save"}
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </Page>
        </AdminSidebar>
    );
};

export default Information;
