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
import { useCallback, useEffect, useState } from "react";
import { Enumeration } from "../../../../api/models/enumeration";
import { Epic } from "../../../../api/models/epic";
import { createEpic } from "../../../../api/services/epicsService";
import { getIssuesPriorities } from "../../../../api/services/issuesService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";

interface CreateEpicDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
    releaseId?: string;
    sprintId?: string;
}

const CreateEpicDialog = ({
    open,
    handleClose,
    projectId,
    releaseId,
    sprintId,
}: CreateEpicDialogProps) => {
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const getAllIssuesPriorities = useCallback(() => {
        getIssuesPriorities()
            .then((priorities: Enumeration[]) => {
                setPriorities(priorities);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorPriorityId(false);
        setServerErrors([]);
    };

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
        return errorFound;
    };

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        const epic = {
            name: name,
            description: description,
            priorityId: priorityId,
            projectId: projectId,
            releaseId: releaseId,
            sprintId: sprintId,
        };
        createEpic(epic)
            .then((epic: Epic) => {
                console.log(epic);
                handleCloseModal(true);
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
            });
    };

    const resetState = useCallback(() => {
        setName("");
        setDescription("");
        setPriorityId("");
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    useEffect(() => {
        resetState();
        getAllIssuesPriorities();
    }, [resetState, getAllIssuesPriorities]);

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle>Create Epic</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            className="w-full"
                            id="epic-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            error={errorDescription}
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
                    <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default CreateEpicDialog;
