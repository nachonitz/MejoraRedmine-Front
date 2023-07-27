import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useEffect, useState } from "react";
import { Risk } from "../../../../api/models/risk";
import { editRisk, getRiskById } from "../../../../api/services/risksService";

interface EditRiskDialogProps {
    riskId?: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: number;
}

const EditRiskDialog: React.FC<EditRiskDialogProps> = ( { open, handleClose, riskId, projectId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [probability, setProbability] = useState<string>("");
    const [impact, setImpact] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorProbability, setErrorProbability] = useState(false);
    const [errorImpact, setErrorImpact] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);


    useEffect(() => {
        resetState();
        if (open && riskId) {
            handleGetRisk();
        }
    }, [open, riskId]);

    const handleGetRisk = () => {
        if (riskId) {
            getRiskById(riskId).then((risk: Risk) => {
                console.log(risk)
                setName(risk.name);
                setDescription(risk.description);
                setProbability(risk.probability);
                setImpact(risk.impact);
                setStatus(risk.status);
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorProbability(false);
        setErrorImpact(false);
        setErrorStatus(false);
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
        if (!probability || probability === "") {
            setErrorProbability(true);
            errorFound = true;
        }
        if (!impact || impact === "") {
            setErrorImpact(true);
            errorFound = true;
        }
        if (!status || status === "") {
            setErrorStatus(true);
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
        let risk = {
            "id": riskId,
            "name": name,
            "description": description,
            "probability": probability,
            "projectId": projectId,
            "impact": impact,
            "status": status
        }
        editRisk(risk).then((risk: Risk) => {
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

    const resetState = () => {
        setName("");
        setDescription("");
        setProbability("");
        setImpact("");
        setStatus("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Edit Epic</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} value={name} className="w-full" id="epic-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} value={description} className="w-full" multiline minRows={"2"} maxRows={"4"} id="epic-description" label="Description" variant="outlined" />
                        <FormControl>
                            <InputLabel id="probability-label" error={errorProbability}>Probability</InputLabel>
                            <Select
                                labelId="probability-label"
                                value={probability}
                                label="Probability"
                                error={errorProbability}
                                onChange={(e: any) => setProbability(e.target.value)}
                                defaultValue={probability}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="impact-label" error={errorImpact}>Impact</InputLabel>
                            <Select
                                labelId="impact-label"
                                value={impact}
                                label="Impact"
                                error={errorImpact}
                                onChange={(e: any) => setImpact(e.target.value)}
                                defaultValue={impact}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="status-label" error={errorStatus}>Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                label="Status"
                                error={errorStatus}
                                onChange={(e: any) => setStatus(e.target.value)}
                                defaultValue={status}
                            >
                                <MenuItem value="Open">Open</MenuItem>
                                <MenuItem value="Closed">Closed</MenuItem>
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
                    <PrimaryButton onClick={handleSubmit}>Edit</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default EditRiskDialog;