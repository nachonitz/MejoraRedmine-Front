import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import SecondaryButton from "../Buttons/SecondaryButton";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useState } from "react";
import { createProject } from "../../api/services/projectsService";
import { Project } from "../../api/models/project";

interface CreateProjectDialogProps {
    open: boolean;
    handleClose: () => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ( { open, handleClose } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [error, setError] = useState("");

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorIdentifier(false);
        setError("");
    }

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!description) {
            setErrorDescription(true);
            errorFound = true;
        }
        if (!identifier) {
            setErrorIdentifier(true);
            errorFound = true;
        }
        return errorFound;
    }

    const handleCreate = () => {
        clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
        let project = {
            "name": name,
            "description": description,
            "identifier": identifier,
            "is_public": !isPrivate,
        }
        createProject(project).then((project: Project) => {
            console.log(project);
            handleCloseModal();
        }).catch((error) => {
            console.log(error)
            setError(error.message);
        });
    }

    const resetState = () => {
        setName("");
        setDescription("");
        setIdentifier("");
        setIsPrivate(false);
        clearErrors();
    };

    const handleCloseModal = () => {
        resetState();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseModal}>
            <div className="w-[400px]">
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="project-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setIdentifier(e.target.value)} error={errorIdentifier} className="w-full" id="project-identifier" placeholder="project-identifier" label="Identifier" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="project-description" label="Description" variant="outlined" />
                        <CustomSwitch onClick={setIsPrivate} title="Private" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                    <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default CreateProjectDialog;