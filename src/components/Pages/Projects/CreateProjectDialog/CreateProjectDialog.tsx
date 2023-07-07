import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import CustomSwitch from "../../../Shared/CustomSwitch/CustomSwitch";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useState } from "react";
import { createProject } from "../../../../api/services/projectsService";
import { Project } from "../../../../api/models/project";

interface CreateProjectDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ( { open, handleClose } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorIdentifier(false);
        setServerErrors([]);
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
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

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

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Create Project</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="project-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setIdentifier(e.target.value)} error={errorIdentifier} className="w-full" id="project-identifier" placeholder="project-identifier" label="Identifier" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="project-description" label="Description" variant="outlined" />
                        <CustomSwitch onClick={setIsPrivate} title="Private" />
                        {serverErrors && serverErrors.length > 0 && <div className='mt-2 min-h-[10px] text-left'>
                            {serverErrors.map((error, index) => (<div key={index}>
                                <p className='text-red-700'> { error }</p>
                            </div>))}
                        </div>}
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