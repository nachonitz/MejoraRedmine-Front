import { useContext, useState } from "react";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { IoLogInOutline } from "react-icons/io5";
import { LiaIdCardSolid } from "react-icons/lia";
import { MdOutlineMail } from "react-icons/md";
import PrimaryButton from "../../components/Shared/Buttons/PrimaryButton";
import Page from "../../components/Shared/Page/Page";
import PageTitle from "../../components/Shared/Page/PageTitle/PageTitle";
import { errorToast, successToast } from "../../components/Shared/Toast";
import { UserContext } from "../../context/UserContext";

const Profile = () => {
    const { user, updateUser } = useContext(UserContext);
    const [firstname, setFirstName] = useState<string | undefined>(
        user?.firstname
    );
    const [lastname, setLastName] = useState<string | undefined>(
        user?.lastname
    );
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState<string | undefined>(user?.mail);
    const [errorFirstName, setErrorFirstName] = useState(false);
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

    const save = async () => {
        if (!firstname) {
            setErrorFirstName(true);
        }
        if (!lastname) {
            setErrorLastName(true);
        }
        if (!email) {
            setErrorEmail(true);
        }
        if (!firstname || !lastname || !email) {
            return;
        }
        if (user) {
            setIsLoading(true);
            try {
                await updateUser(user?.id, {
                    firstname,
                    lastname,
                    mail: email,
                });
                successToast("Profile edited successfully");
            } catch (error) {
                errorToast("Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Page>
            <div className="flex w-full flex-col items-center">
                <div className="w-96 flex flex-col gap-10">
                    <div className="flex gap-[15px]">
                        <PageTitle title="Profile" />
                    </div>
                    <div className="flex flex-col gap-5">
                        <TextField
                            value={user?.login}
                            className="w-full"
                            id="sprint-name"
                            label="Login"
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IoLogInOutline className="text-[18px]" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            onChange={(e) => setFirstName(e.target.value)}
                            error={errorFirstName}
                            value={firstname}
                            className="w-full"
                            id="sprint-name"
                            label="First Name"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LiaIdCardSolid className="text-[18px]" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            onChange={(e) => setLastName(e.target.value)}
                            error={errorLastName}
                            value={lastname}
                            className="w-full"
                            id="sprint-name"
                            label="Last Name"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LiaIdCardSolid className="text-[18px]" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            onChange={(e) => setEmail(e.target.value)}
                            error={errorEmail}
                            value={email}
                            className="w-full"
                            id="sprint-name"
                            label="Email"
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdOutlineMail className="text-[18px]" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* {user?.createdAt && (
                            <span>{getFullDate(user?.createdAt)}</span>
                        )} */}
                    </div>
                    <PrimaryButton
                        onClick={() => {
                            save();
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress
                                sx={{ color: "white", padding: 0 }}
                                size={20}
                            />
                        ) : (
                            "Save"
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </Page>
    );
};

export default Profile;
