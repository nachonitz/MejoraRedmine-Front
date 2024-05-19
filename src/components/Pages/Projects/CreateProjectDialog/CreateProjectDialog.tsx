import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { CreateProjectDto } from "../../../../api/models/project";
import { createProject } from "../../../../api/services/projectsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import CustomSwitch from "../../../Shared/CustomSwitch/CustomSwitch";
import { errorToast, successToast } from "../../../Shared/Toast";

interface CreateProjectDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const CreateProjectDialog = ({
    open,
    handleClose,
}: CreateProjectDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearErrors = () => {
        setErrorName(false);
        setErrorIdentifier(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!identifier) {
            setErrorIdentifier(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const project: CreateProjectDto = {
            name: name,
            description: description,
            identifier: identifier,
            isPublic: !isPrivate,
        };
        createProject(project)
            .then(() => {
                handleCloseModal(true);
                successToast("Project created successfully");
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const resetState = () => {
        setName("");
        setDescription("");
        setIdentifier("");
        setIsPrivate(false);
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    const handleChangeName = (name: string) => {
        setName(name);
        setIdentifier(name.toLowerCase().replace(/ /g, "-"));
    };

    return (
        <Dialog fullWidth={true} open={open} onClose={() => handleCloseModal()}>
            <div className="p-2">
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => handleChangeName(e.target.value)}
                            error={errorName}
                            className="w-full"
                            id="project-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setIdentifier(e.target.value)}
                            error={errorIdentifier}
                            value={identifier}
                            className="w-full"
                            id="project-identifier"
                            placeholder="project-identifier"
                            label="Identifier"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                            multiline
                            minRows={"2"}
                            maxRows={"4"}
                            id="project-description"
                            label="Description"
                            variant="outlined"
                        />
                        <CustomSwitch onClick={setIsPrivate} title="Private" />
                        {serverErrors && serverErrors.length > 0 && (
                            <div className="mt-2 min-h-[10px] text-left">
                                {serverErrors.map((error, index) => (
                                    <div key={index}>
                                        <p className="text-red-700"> {error}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={handleCloseModal}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton onClick={handleCreate}>
                            {isLoading ? (
                                <CircularProgress
                                    sx={{ color: "white", padding: 0 }}
                                    size={20}
                                />
                            ) : (
                                "Create"
                            )}
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateProjectDialog;
