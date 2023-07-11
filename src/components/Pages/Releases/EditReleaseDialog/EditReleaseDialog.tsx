import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import CustomSwitch from "../../../Shared/CustomSwitch/CustomSwitch";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { editProject, getProject } from "../../../../api/services/projectsService";
import { Project } from "../../../../api/models/project";
import { editRelease, getReleasae } from "../../../../api/services/releasesService";
import { Release } from "../../../../api/models/release";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface EditReleaseDialogProps {
    releaseId?: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const EditReleaseDialog: React.FC<EditReleaseDialogProps> = ( { open, handleClose, releaseId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);


    useEffect(() => {
        resetState();
        if (open && releaseId) {
            handleGetRelease();
        }
    }, [open, releaseId]);

    const handleGetRelease = () => {
        if (releaseId) {
            getReleasae(releaseId).then((release: Release) => {
                console.log(release)
                setName(release.name);
                setDescription(release.description);
                setStartDate(dayjs(release.startDate));
                setEndDate(dayjs(release.endDate));
            }).catch((error) => {
                console.log(error);
            });
        }
    }

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

    const handleSubmit = () => {
        clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
        let release = {
            "id": releaseId,
            "name": name,
            "description": description,
            "startDate": startDate,
            "endDate": endDate,
        }
        editRelease(release).then((release: Release) => {
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
        handleClose(refresh);
        resetState();
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Edit Release</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} value={name} className="w-full" id="project-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} value={description} className="w-full" multiline minRows={"2"} maxRows={"4"} id="project-description" label="Description" variant="outlined" />
                        <DatePicker onChange={(date: any) => setStartDate(date)} slotProps={{ textField: { error: errorStartDate } }} value={startDate} label="Start Date" />
                        <DatePicker onChange={(date: any) => setEndDate(date)} slotProps={{ textField: { error: errorEndDate } }} minDate={startDate} value={endDate}  label="End Date" />
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

export default EditReleaseDialog;