import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import { Epic, UpdateEpicDto } from "../../../../api/models/epic";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import { editEpic, getEpicById } from "../../../../api/services/epicsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface EditEpicDialogProps {
    epicId: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const EditEpicDialog: React.FC<EditEpicDialogProps> = ({
    open,
    handleClose,
    epicId,
}) => {
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [priorityId, setPriorityId] = useState<number>();
    const [errorName, setErrorName] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllIssuesPriorities = async () => {
        const { data } = await getEnumerations({
            type: EnumerationType.PRIORITY,
        });
        setPriorities(data);
    };

    const handleGetEpic = useCallback(() => {
        if (epicId) {
            getEpicById(epicId)
                .then((epic: Epic) => {
                    setName(epic.name);
                    setDescription(epic.description);
                    setPriorityId(epic.priority.id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [epicId]);

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
        if (!priorityId) {
            setErrorPriorityId(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleSubmit = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const epic: UpdateEpicDto = {
            name: name,
            description: description,
            priorityId: priorityId,
        };
        editEpic(epicId, epic)
            .then(() => {
                handleCloseModal(true);
                successToast("Epic edited successfully");
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const resetState = useCallback(() => {
        setName("");
        setDescription("");
        setPriorityId(undefined);
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    useEffect(() => {
        const fetch = async () => {
            resetState();
            await getAllIssuesPriorities();
            if (open && epicId) {
                handleGetEpic();
            }
        };
        fetch();
    }, [open, epicId, resetState, handleGetEpic]);

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle>Edit Epic</DialogTitle>
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
                            error={errorDescription}
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
                                onChange={(e) => setPriorityId(+e.target.value)}
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
                    <PrimaryButton onClick={handleSubmit}>
                        {isLoading ? (
                            <CircularProgress
                                sx={{ color: "white", padding: 0 }}
                                size={20}
                            />
                        ) : (
                            "Edit"
                        )}
                    </PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditEpicDialog;
