import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { editEpic, getEpic } from "../../../../api/services/epicsService";
import { Epic } from "../../../../api/models/epic";

interface EditEpicDialogProps {
    epicId?: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const EditEpicDialog: React.FC<EditEpicDialogProps> = ( { open, handleClose, epicId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriority, setErrorPriority] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);


    useEffect(() => {
        resetState();
        if (open && epicId) {
            handleGetEpic();
        }
    }, [open, epicId]);

    const handleGetEpic = () => {
        if (epicId) {
            getEpic(epicId).then((epic: Epic) => {
                console.log(epic)
                setName(epic.name);
                setDescription(epic.description);
                setPriority(epic.priority);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

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

    const handleSubmit = () => {
        clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
        let epic = {
            "id": epicId,
            "name": name,
            "description": description,
            "priority": priority,
        }
        editEpic(epic).then((epic: Epic) => {
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
        handleClose(refresh);
        resetState();
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Edit Epic</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} value={name} className="w-full" id="epic-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} value={description} className="w-full" multiline minRows={"2"} maxRows={"4"} id="epic-description" label="Description" variant="outlined" />
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
                    <PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default EditEpicDialog;