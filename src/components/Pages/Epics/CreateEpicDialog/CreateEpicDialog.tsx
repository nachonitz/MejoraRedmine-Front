import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createEpic } from "../../../../api/services/epicsService";
import { Epic } from "../../../../api/models/epic";

interface CreateEpicDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
    releaseId?: string;
    sprintId?: string;
}

const CreateEpicDialog: React.FC<CreateEpicDialogProps> = ( { open, handleClose, projectId, releaseId, sprintId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriority, setErrorPriority] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorPriority(false);
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
        if (!priority || priority === "") {
            setErrorPriority(true);
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
        let epic = {
            "name": name,
            "description": description,
            "priority": priority,
            "projectId": projectId,
            "releaseId": releaseId,
            "sprintId": sprintId
        }
        createEpic(epic).then((epic: Epic) => {
            console.log(epic);
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

    const resetState = () => {
        setName("");
        setDescription("");
        setPriority("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Create Epic</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="epic-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="epic-description" label="Description" variant="outlined" />
                        <FormControl>
                            <InputLabel id="priority-label" error={errorPriority}>Priority</InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priority}
                                label="Priority"
                                error={errorPriority}
                                onChange={(e: any) => setPriority(e.target.value)}
                            >
                                <MenuItem value="Very low">Very low</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                                <MenuItem value="Very high">Very high</MenuItem>
                            </Select>
                        </FormControl>
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

export default CreateEpicDialog;