import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Release } from "../../../../api/models/release";
import { createRelease } from "../../../../api/services/releasesService";

interface CreateReleaseDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
}

const CreateReleaseDialog: React.FC<CreateReleaseDialogProps> = ( { open, handleClose, projectId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorStartDate(false);
        setErrorEndDate(false);
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
        if (!startDate || !(new Date(startDate).getTime())) {
            setErrorStartDate(true);
            errorFound = true;
        }
        if (!endDate || !(new Date(endDate).getTime())) {
            setErrorEndDate(true);
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
        let release = {
            "name": name,
            "description": description,
            "startDate": new Date(startDate),
            "endDate": new Date(endDate),
            "projectId": projectId
        }
        createRelease(release).then((release: Release) => {
            console.log(release);
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

    const resetState = () => {
        setName("");
        setDescription("");
        setStartDate(null);
        setEndDate(null);
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Create Release</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="project-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="project-description" label="Description" variant="outlined" />
                        <DatePicker onChange={(date: any) => setStartDate(date)} slotProps={{ textField: { error: errorStartDate } }} label="Start Date" />
                        <DatePicker onChange={(date: any) => setEndDate(date)} slotProps={{ textField: { error: errorEndDate } }} minDate={startDate} label="End Date" />
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

export default CreateReleaseDialog;