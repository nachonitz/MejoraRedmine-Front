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
import { useState } from "react";
import {
    CreateRiskDto,
    RiskEnumeration,
    RiskStatus,
} from "../../../../api/models/risk";
import { createRisk } from "../../../../api/services/risksService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";

interface CreateRiskDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId: string;
}

const CreateRiskDialog = ({
    open,
    handleClose,
    projectId,
}: CreateRiskDialogProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [probability, setProbability] = useState<RiskEnumeration>(
        RiskEnumeration.LOW
    );
    const [impact, setImpact] = useState<RiskEnumeration>(RiskEnumeration.LOW);
    const [errorName, setErrorName] = useState(false);
    const [errorProbability, setErrorProbability] = useState(false);
    const [errorImpact, setErrorImpact] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearErrors = () => {
        setErrorName(false);
        setErrorProbability(false);
        setErrorImpact(false);
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
        return errorFound;
    };

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const risk: CreateRiskDto = {
            name: name,
            description: description,
            probability: probability,
            projectId: +projectId,
            impact: impact,
            status: RiskStatus.OPEN,
        };
        createRisk(risk)
            .then(() => {
                handleCloseModal(true);
                successToast("Risk created successfully");
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
        setProbability(RiskEnumeration.LOW);
        setImpact(RiskEnumeration.LOW);
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog fullWidth={true} open={open} onClose={() => handleCloseModal()}>
            <div>
                <DialogTitle>Create Risk</DialogTitle>
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
                    <PrimaryButton onClick={handleCreate} className="h-[50px]">
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

export default CreateRiskDialog;
