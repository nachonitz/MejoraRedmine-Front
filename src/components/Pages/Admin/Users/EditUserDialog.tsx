import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";
import { UpdateUserDto, User } from "../../../../api/models/user";
import { editUser } from "../../../../api/services/usersService";

interface Props {
    user: User;
    open: boolean;
    onClose: (refresh?: boolean) => void;
}

export const EditUserDialog = ({ user, open, onClose }: Props) => {
    const [login, setLogin] = useState<string>("");
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [mail, setMail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorLogin, setErrorLogin] = useState<boolean>(false);
    const [errorMail, setErrorMail] = useState<boolean>(false);
    const [errorName, setErrorName] = useState<boolean>(false);
    const [errorLastname, setErrorLastname] = useState<boolean>(false);
    const [errorPassword, _setErrorPassword] = useState<boolean>(false);

    useEffect(() => {
        setLogin(user.login);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setMail(user.mail);
    }, [user]);

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
        return errorFound;
    };

    const handleEdit = async () => {
        const errors = checkForFieldsErrors();
        if (errors) return;

        let updatedUser: UpdateUserDto = {
            login,
            firstname,
            lastname,
            mail,
        };

        if (password) {
            updatedUser = {
                ...updatedUser,
                password,
            };
        }

        try {
            let res = await editUser(user.id, updatedUser);
            if (res) {
                successToast("User edited successfully");
                onClose(true);
            } else {
                errorToast("Something went wrong");
            }
        } catch (error: any) {
            let message =
                error?.messages.length > 0
                    ? error.messages[0]
                    : "Something went wrong";
            errorToast(message);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose()}>
            <div className="w-[600px]">
                <DialogTitle>Edit user</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setLogin(e.target.value)}
                            error={errorLogin}
                            value={login}
                            className="w-full"
                            id="login"
                            label="Login"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setMail(e.target.value)}
                            error={errorMail}
                            value={mail}
                            className="w-full"
                            id="mail"
                            label="Email"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setFirstname(e.target.value)}
                            error={errorName}
                            value={firstname}
                            className="w-full"
                            id="firstname"
                            label="First Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setLastname(e.target.value)}
                            error={errorLastname}
                            value={lastname}
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
                <DialogActions>
                    <SecondaryButton onClick={() => onClose()}>
                        Close
                    </SecondaryButton>
                    <PrimaryButton onClick={handleEdit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
