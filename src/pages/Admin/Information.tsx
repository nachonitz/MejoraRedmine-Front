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

const Information = () => {
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
                <PageTitle title="Information" />
                <div className="mt-[30px]">
                    <div className="w-full mt-4 flex flex-col gap-5">
                        <div className="flex flex-col gap-[20px]">
                            <TextField
                                onChange={(e) => setTitle(e.target.value)}
                                error={errorTitle}
                                value={title}
                                className="w-full"
                                id="title"
                                label="Title"
                                variant="outlined"
                            />
                            <TextField
                                onChange={(e) => setPath(e.target.value)}
                                error={errorPath}
                                value={path}
                                className="w-full"
                                id="path"
                                label="Path"
                                variant="outlined"
                            />
                            <FormControl>
                                <InputLabel
                                    id="protocol-label"
                                    error={errorProtocol}
                                >
                                    Protocol
                                </InputLabel>
                                <Select
                                    labelId="protocol-label"
                                    value={protocol}
                                    label="Protocol"
                                    error={errorProtocol}
                                    onChange={(e) =>
                                        setProtocol(e.target.value as string)
                                    }
                                    defaultValue={protocol}
                                >
                                    <MenuItem value={"HTTP"}>HTTP</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <PrimaryButton
                                onClick={() => setLoading(!isLoading)}
                            >
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
