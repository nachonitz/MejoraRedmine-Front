import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useEffect, useState, useContext } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createEpic } from "../../../../api/services/epicsService";
import { Epic } from "../../../../api/models/epic";
import { createIssue, getIssuesPriorities, getTrackers } from "../../../../api/services/issuesService";
import { Tracker } from "../../../../api/models/tracker";
import { Enumeration } from "../../../../api/models/enumeration";
import { Issue } from "../../../../api/models/issue";
import { UserContext } from "../../../../context/UserContext";

interface CreateIssueDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
    releaseId?: string;
    sprintId?: string;
    epicId?: string;
}

const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ( { open, handleClose, projectId, releaseId, sprintId, epicId } ) => {
    const { user } = useContext( UserContext );
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [estimations, setEstimations] = useState<string[]>(["XS", "S", "M", "L", "XL"]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [trackerId, setTrackerId] = useState<string>("");
    const [estimation, setEstimation] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [errorTrackerId, setErrorTrackerId] = useState(false);
    const [errorEstimation, setErrorEstimation] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    useEffect(() => {
        resetState();
        getAllIssuesPriorities();
        getAllTrackers();
    }, []);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorPriorityId(false);
        setErrorTrackerId(false)
        setErrorEstimation(false);
        setServerErrors([]);
    }

    const getAllIssuesPriorities = () => {
        getIssuesPriorities().then((priorities: Enumeration[]) => {
            setPriorities(priorities);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getAllTrackers = () => {
        getTrackers().then((trackers: Tracker[]) => {
            setTrackers(trackers);
        }).catch((error) => {
            console.log(error);
        });
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
        if (!priorityId || priorityId === "") {
            setErrorPriorityId(true);
            errorFound = true;
        }
        if (!trackerId || trackerId === "") {
            setErrorTrackerId(true);
            errorFound = true;
        }
        if (!estimation || estimation === "") {
            setErrorEstimation(true);
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
        let issue = {
            "subject": name,
            "description": description,
            "priorityId": priorityId,
            "trackerId": trackerId,
            "projectId": projectId ? parseInt(projectId) : "",
            "releaseId": releaseId ? parseInt(releaseId) : "",
            "sprintId": sprintId ? parseInt(sprintId) : "",
            "epicId": epicId ? parseInt(epicId) : "",
            "assigneeId": user?.id,
            "estimation": estimation
        }
        createIssue(issue).then((issue: Issue) => {
            console.log(issue);
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

    const resetState = () => {
        setName("");
        setDescription("");
        setPriorityId("");
        setTrackerId("");
        setEstimation("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Create Issue</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="epic-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="epic-description" label="Description" variant="outlined" />
                        <FormControl>
                            <InputLabel id="priority-label" error={errorPriorityId}>Priority</InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priorityId}
                                label="Priority"
                                error={errorPriorityId}
                                onChange={(e: any) => setPriorityId(e.target.value)}
                            >
                                {priorities && priorities.map((priority: Enumeration) => (<MenuItem key={priority.id} value={priority.id}>{priority.name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="priority-label" error={errorTrackerId}>Tracker</InputLabel>
                            <Select
                                labelId="priority-label"
                                value={trackerId}
                                label="Priority"
                                error={errorTrackerId}
                                onChange={(e: any) => setTrackerId(e.target.value)}
                            >
                                {trackers && trackers.map((tracker: Tracker) => (<MenuItem key={tracker.id} value={tracker.id}>{tracker.name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="priority-label" error={errorEstimation}>Estimation</InputLabel>
                            <Select
                                labelId="priority-label"
                                value={estimation}
                                label="Priority"
                                error={errorEstimation}
                                onChange={(e: any) => setEstimation(e.target.value)}
                            >
                                {estimations && estimations.map((estimation: string) => (<MenuItem key={estimation} value={estimation}>{estimation}</MenuItem>))}
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

export default CreateIssueDialog;