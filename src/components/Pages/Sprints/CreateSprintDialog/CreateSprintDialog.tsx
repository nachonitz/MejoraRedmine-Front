import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { CreateSprintDto } from "../../../../api/models/sprint";
import { createSprint } from "../../../../api/services/sprintsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface CreateSprintDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId: number;
    releaseId: number;
}

const CreateSprintDialog = ({
    open,
    handleClose,
    projectId,
    releaseId,
}: CreateSprintDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [errorName, setErrorName] = useState(false);
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearErrors = () => {
        setErrorName(false);
        setErrorStartDate(false);
        setErrorEndDate(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!startDate || !new Date(startDate).getTime()) {
            setErrorStartDate(true);
            errorFound = true;
        }
        if (!endDate || !new Date(endDate).getTime()) {
            setErrorEndDate(true);
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
        const sprint: CreateSprintDto = {
            name: name,
            description: description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            releaseId,
            projectId,
        };
        createSprint(sprint)
            .then(() => {
                handleCloseModal(true);
                successToast("Sprint created successfully");
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
        <Dialog fullWidth={true} open={open} onClose={() => handleCloseModal()}>
            <div>
                <DialogTitle>Create Sprint</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            className="w-full"
                            id="sprint-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                            multiline
                            minRows={"2"}
                            maxRows={"4"}
                            id="sprint-description"
                            label="Description"
                            variant="outlined"
                        />
                        <DatePicker
                            onChange={(date) => setStartDate(date)}
                            slotProps={{ textField: { error: errorStartDate } }}
                            label="Start Date"
                        />
                        <DatePicker
                            onChange={(date) => setEndDate(date)}
                            slotProps={{ textField: { error: errorEndDate } }}
                            minDate={startDate}
                            label="End Date"
                        />
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
        </Dialog>
    );
};

export default CreateSprintDialog;
