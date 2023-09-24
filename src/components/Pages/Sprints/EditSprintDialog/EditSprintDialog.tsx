import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { Sprint, UpdateSprintDto } from "../../../../api/models/sprint";
import {
    editSprint,
    getSprintById,
} from "../../../../api/services/sprintsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface EditSprintDialogProps {
    sprintId: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const EditSprintDialog = ({
    open,
    handleClose,
    sprintId,
}: EditSprintDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [startDate, setStartDate] = useState<any>(null);
    const [endDate, setEndDate] = useState<any>(null);
    const [errorName, setErrorName] = useState(false);
    const [errorStartDate, setErrorStartDate] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const handleGetSprint = useCallback(() => {
        if (sprintId) {
            getSprintById(sprintId)
                .then((sprint: Sprint) => {
                    setName(sprint.name);
                    setDescription(sprint.description);
                    setStartDate(dayjs(sprint.startDate));
                    setEndDate(dayjs(sprint.endDate));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [sprintId]);

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

    const handleSubmit = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        const sprint: UpdateSprintDto = {
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
        };
        editSprint(sprintId, sprint)
            .then(() => {
                handleCloseModal(true);
                successToast("Sprint edited successfully");
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            });
    };

    const resetState = useCallback(() => {
        setName("");
        setDescription("");
        setStartDate(null);
        setEndDate(null);
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    useEffect(() => {
        resetState();
        if (open && sprintId) {
            handleGetSprint();
        }
    }, [open, sprintId, resetState, handleGetSprint]);

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle>Edit Sprint</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            value={name}
                            className="w-full"
                            id="sprint-name"
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
                            id="sprint-description"
                            label="Description"
                            variant="outlined"
                        />
                        <DatePicker
                            onChange={(date) => setStartDate(date)}
                            slotProps={{ textField: { error: errorStartDate } }}
                            value={startDate}
                            label="Start Date"
                        />
                        <DatePicker
                            onChange={(date) => setEndDate(date)}
                            slotProps={{ textField: { error: errorEndDate } }}
                            minDate={startDate}
                            value={endDate}
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
                    <PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditSprintDialog;
