import {
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
    Risk,
    RiskEnumeration,
    RiskStatus,
    UpdateRiskDto,
} from "../../../../api/models/risk";
import { editRisk, getRiskById } from "../../../../api/services/risksService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface EditRiskDialogProps {
    riskId: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: number;
}

const EditRiskDialog = ({
    open,
    handleClose,
    riskId,
    projectId,
}: EditRiskDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [probability, setProbability] = useState<RiskEnumeration>(
        RiskEnumeration.LOW
    );
    const [impact, setImpact] = useState<RiskEnumeration>(RiskEnumeration.LOW);
    const [status, setStatus] = useState<RiskStatus>(RiskStatus.OPEN);
    const [errorName, setErrorName] = useState(false);
    const [errorProbability, setErrorProbability] = useState(false);
    const [errorImpact, setErrorImpact] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const handleGetRisk = useCallback(() => {
        if (riskId) {
            getRiskById(riskId)
                .then((risk: Risk) => {
                    setName(risk.name);
                    setDescription(risk.description);
                    setProbability(risk.probability);
                    setImpact(risk.impact);
                    setStatus(risk.status);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [riskId]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorProbability(false);
        setErrorImpact(false);
        setErrorStatus(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!probability) {
            setErrorProbability(true);
            errorFound = true;
        }
        if (!impact) {
            setErrorImpact(true);
            errorFound = true;
        }
        if (!status) {
            setErrorStatus(true);
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
        const risk: UpdateRiskDto = {
            name: name,
            description: description,
            probability: probability,
            projectId: projectId,
            impact: impact,
            status: status,
        };
        editRisk(riskId, risk)
            .then(() => {
                handleCloseModal(true);
                successToast("Risk edited successfully");
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
        setProbability(RiskEnumeration.LOW);
        setImpact(RiskEnumeration.LOW);
        setStatus(RiskStatus.OPEN);
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    useEffect(() => {
        resetState();
        if (open && riskId) {
            handleGetRisk();
        }
    }, [open, riskId, resetState, handleGetRisk]);

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
                                id="probability-label"
                                error={errorProbability}
                            >
                                Probability
                            </InputLabel>
                            <Select
                                labelId="probability-label"
                                value={probability}
                                label="Probability"
                                error={errorProbability}
                                onChange={(e) =>
                                    setProbability(
                                        e.target.value as RiskEnumeration
                                    )
                                }
                                defaultValue={probability}
                            >
                                {Object.entries(RiskEnumeration).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="impact-label" error={errorImpact}>
                                Impact
                            </InputLabel>
                            <Select
                                labelId="impact-label"
                                value={impact}
                                label="Impact"
                                error={errorImpact}
                                onChange={(e) =>
                                    setImpact(e.target.value as RiskEnumeration)
                                }
                                defaultValue={impact}
                            >
                                {Object.entries(RiskEnumeration).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="status-label" error={errorStatus}>
                                Status
                            </InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                label="Status"
                                error={errorStatus}
                                onChange={(e) =>
                                    setStatus(e.target.value as RiskStatus)
                                }
                                defaultValue={status}
                            >
                                {Object.entries(RiskStatus).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
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
                    <PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditRiskDialog;
