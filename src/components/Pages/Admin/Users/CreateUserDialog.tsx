import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { createUser } from "../../../../api/services/usersService";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface Props {
    open: boolean;
    onClose: (refresh?: boolean) => void;
}

export const CreateUserDialog = ({ open, onClose }: Props) => {
    const [login, setLogin] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [mail, setMail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorLogin, setErrorLogin] = useState<boolean>(false);
    const [errorMail, setErrorMail] = useState<boolean>(false);
    const [errorName, setErrorName] = useState<boolean>(false);
    const [errorLastname, setErrorLastname] = useState<boolean>(false);
    const [errorPassword, setErrorPassword] = useState<boolean>(false);

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!login) {
            setErrorLogin(true);
            errorFound = true;
        }
        if (!mail) {
            setErrorMail(true);
            errorFound = true;
        }
        if (!firstname) {
            setErrorName(true);
            errorFound = true;
        }
        if (!lastname) {
            setErrorLastname(true);
            errorFound = true;
        }
        if (!password) {
            setErrorPassword(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleCreate = async () => {
        const errors = checkForFieldsErrors();
        if (errors) return;
        const res = await createUser({
            login,
            firstname,
            lastname,
            mail,
            password,
        });
        if (res) {
            successToast("User created successfully");
        } else {
            errorToast("Something went wrong");
        }
        onClose(!!res);
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <div className="w-[600px]">
                <DialogTitle>Create user</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setLogin(e.target.value)}
                            error={errorLogin}
                            className="w-full"
                            id="login"
                            label="Login"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setMail(e.target.value)}
                            error={errorMail}
                            className="w-full"
                            id="mail"
                            label="Email"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setFirstname(e.target.value)}
                            error={errorName}
                            className="w-full"
                            id="firstname"
                            label="First Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setLastname(e.target.value)}
                            error={errorLastname}
                            className="w-full"
                            id="lastname"
                            label="Last Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setPassword(e.target.value)}
                            error={errorPassword}
                            className="w-full"
                            id="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                        />
                    </div>
                </DialogContent>
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={() => onClose()}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton onClick={handleCreate}>
                            Create
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};
