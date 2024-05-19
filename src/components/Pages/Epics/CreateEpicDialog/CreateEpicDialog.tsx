import {
    CircularProgress,
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
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import { CreateEpicDto } from "../../../../api/models/epic";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import { createEpic } from "../../../../api/services/epicsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface CreateEpicDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId: string;
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
    const [description, setDescription] = useState<string | undefined>("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllIssuesPriorities = useCallback(async () => {
        const { data } = await getEnumerations({
            type: EnumerationType.PRIORITY,
        });
        setPriorities(data);
    }, []);

    const clearErrors = () => {
        setErrorName(false);
        setErrorPriorityId(false);
        setServerErrors([]);
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
        return errorFound;
    };

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const epic: CreateEpicDto = {
            name: name,
            description: description,
            priorityId: +priorityId,
            projectId: +projectId,
            releaseId: releaseId ? +releaseId : undefined,
            sprintId: sprintId ? +sprintId : undefined,
        };
        createEpic(epic)
            .then(() => {
                handleCloseModal(true);
                successToast("Epic created successfully");
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
        <Dialog fullWidth={true} open={open} onClose={() => handleCloseModal()}>
            <div>
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
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={handleClose}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton onClick={handleCreate}>
                            {isLoading ? (
                                <CircularProgress
                                    sx={{ color: "white", padding: 0 }}
                                    size={20}
                                />
                            ) : (
                                "Create"
                            )}
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateEpicDialog;
