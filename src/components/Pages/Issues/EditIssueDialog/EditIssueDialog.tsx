import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import {
    Issue,
    IssueStatus,
    UpdateIssueDto,
} from "../../../../api/models/issue";
import { Tracker } from "../../../../api/models/tracker";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import {
    editIssue,
    getIssueById,
    getIssuesStatuses,
    getTrackers,
} from "../../../../api/services/issuesService";
import { UserContext } from "../../../../context/UserContext";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface EditIssueDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    issueId: number;
}

const EditIssueDialog: React.FC<EditIssueDialogProps> = ({
    open,
    handleClose,
    issueId,
}) => {
    const { user } = useContext(UserContext);
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [estimations, setEstimations] = useState<string[]>([
        "XS",
        "S",
        "M",
        "L",
        "XL",
    ]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [trackerId, setTrackerId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [estimation, setEstimation] = useState<string | undefined>("");
    const [errorName, setErrorName] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [errorTrackerId, setErrorTrackerId] = useState(false);
    const [errorStatusId, setErrorStatusId] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetch = async () => {
            resetState();
            await getAllIssuesPriorities();
            getAllTrackers();
            getAllIssuesStatuses();
            if (open && issueId) {
                handleGetIssue();
            }
        };
        fetch();
    }, [open, issueId]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorPriorityId(false);
        setErrorTrackerId(false);
        setErrorStatusId(false);
        setServerErrors([]);
    };

    const handleGetIssue = () => {
        if (issueId) {
            getIssueById(issueId)
                .then((issue: Issue) => {
                    console.log(issue);
                    setName(issue.subject);
                    setDescription(issue.description);
                    setPriorityId(issue.priority.id.toString());
                    setEstimation(issue.estimation);
                    setStatusId(issue.status.id.toString());
                    setTrackerId(issue.tracker.id.toString());
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const getAllIssuesStatuses = () => {
        getIssuesStatuses()
            .then((statuses: IssueStatus[]) => {
                setStatuses(statuses);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllIssuesPriorities = async () => {
        const { data } = await getEnumerations({
            type: EnumerationType.PRIORITY,
        });
        setPriorities(data);
    };

    const getAllTrackers = () => {
        getTrackers()
            .then((trackers: Tracker[]) => {
                setTrackers(trackers);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
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
        if (!statusId || statusId === "") {
            setErrorStatusId(true);
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
        const issue: UpdateIssueDto = {
            subject: name,
            description: description,
            priorityId: +priorityId,
            trackerId: +trackerId,
            estimation: estimation,
            statusId: +statusId,
        };
        editIssue(issueId, issue)
            .then(() => {
                handleCloseModal(true);
                successToast("Issue edited successfully");
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            });
    };

    const resetState = () => {
        setName("");
        setDescription("");
        setPriorityId("");
        setTrackerId("");
        setEstimation("");
        setStatusId("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle>Edit Issue</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            value={name}
                            className="w-full"
                            id="epic-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full"
                            multiline
                            minRows={"2"}
                            maxRows={"4"}
                            id="epic-description"
                            label="Description"
                            variant="outlined"
                        />
                        <FormControl>
                            <InputLabel
                                id="priority-label"
                                error={errorPriorityId}
                            >
                                Priority
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priorityId}
                                label="Priority"
                                error={errorPriorityId}
                                onChange={(e) => setPriorityId(e.target.value)}
                            >
                                {priorities &&
                                    priorities.map((priority: Enumeration) => (
                                        <MenuItem
                                            key={priority.id}
                                            value={priority.id}
                                        >
                                            {priority.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel
                                id="priority-label"
                                error={errorTrackerId}
                            >
                                Tracker
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={trackerId}
                                label="Priority"
                                error={errorTrackerId}
                                onChange={(e) => setTrackerId(e.target.value)}
                            >
                                {trackers &&
                                    trackers.map((tracker: Tracker) => (
                                        <MenuItem
                                            key={tracker.id}
                                            value={tracker.id}
                                        >
                                            {tracker.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="priority-label">
                                Estimation
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={estimation}
                                label="Priority"
                                onChange={(e) => setEstimation(e.target.value)}
                            >
                                {estimations &&
                                    estimations.map((estimation: string) => (
                                        <MenuItem
                                            key={estimation}
                                            value={estimation}
                                        >
                                            {estimation}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel
                                id="priority-label"
                                error={errorStatusId}
                            >
                                Status
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={statusId}
                                label="Priority"
                                error={errorStatusId}
                                onChange={(e) => setStatusId(e.target.value)}
                            >
                                {statuses &&
                                    statuses.map((status: IssueStatus) => (
                                        <MenuItem
                                            key={status.id}
                                            value={status.id}
                                        >
                                            {status.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
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
                    <PrimaryButton onClick={handleCreate}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditIssueDialog;
