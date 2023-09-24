import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Project, UpdateProjectDto } from "../../../../api/models/project";
import {
    editProject,
    getProjectById,
} from "../../../../api/services/projectsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import CustomSwitch from "../../../Shared/CustomSwitch/CustomSwitch";
import { errorToast, successToast } from "../../../Shared/Toast";

interface EditProjectDialogProps {
    projectId?: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
    open,
    handleClose,
    projectId,
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [identifier, setIdentifier] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const handleGetProject = useCallback(() => {
        if (projectId) {
            getProjectById(projectId)
                .then((project: Project) => {
                    setName(project.name);
                    setDescription(project.description);
                    setIdentifier(project.identifier);
                    setIsPrivate(!project.isPublic);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [projectId]);

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

    const handleSubmit = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound || !projectId) {
            return;
        }
        const project: UpdateProjectDto = {
            name: name,
            description: description,
            identifier: identifier,
            isPublic: !isPrivate,
        };
        editProject(projectId, project)
            .then(() => {
                handleCloseModal(true);
                successToast("Project edited successfully");
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            });
    };

    const resetState = useCallback(() => {
        setName("");
        setDescription("");
        setIdentifier("");
        setIsPrivate(false);
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    useEffect(() => {
        resetState();
        if (open && projectId) {
            handleGetProject();
        }
    }, [open, projectId, resetState, handleGetProject]);

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            value={name}
                            className="w-full"
                            id="project-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setIdentifier(e.target.value)}
                            error={errorIdentifier}
                            disabled
                            value={identifier}
                            className="w-full"
                            id="project-identifier"
                            placeholder="project-identifier"
                            label="Identifier"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full"
                            multiline
                            minRows={"2"}
                            maxRows={"4"}
                            id="project-description"
                            label="Description"
                            variant="outlined"
                        />
                        <CustomSwitch
                            value={isPrivate}
                            onClick={setIsPrivate}
                            title="Private"
                        />
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
                <DialogActions>
                    <SecondaryButton onClick={handleClose}>
                        Close
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditProjectDialog;
