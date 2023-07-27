import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useState } from "react";
import { Risk } from "../../../../api/models/risk";
import { createRisk } from "../../../../api/services/risksService";

interface CreateRiskDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
}

const CreateRiskDialog: React.FC<CreateRiskDialogProps> = ( { open, handleClose, projectId } ) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [probability, setProbability] = useState<string>("");
    const [impact, setImpact] = useState<string>("");
    const [errorName, setErrorName] = useState(false);
	const [errorDescription, setErrorDescription] = useState(false);
    const [errorProbability, setErrorProbability] = useState(false);
    const [errorImpact, setErrorImpact] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorProbability(false);
        setErrorImpact(false);
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
        return errorFound;
    }

    const handleCreate = () => {
        clearErrors();
		let errorFound = checkForFieldsErrors();
		if (errorFound) {
			return;
		}
        let risk = {
            "name": name,
            "description": description,
            "probability": probability,
            "projectId": projectId,
            "impact": impact,
            "status": "Open"
        }
        createRisk(risk).then((risk: Risk) => {
            console.log(risk);
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
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Create Risk</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setName(e.target.value)} error={errorName} className="w-full" id="epic-name" label="Name" variant="outlined" />
                        <TextField onChange={(e) => setDescription(e.target.value)} error={errorDescription} className="w-full" multiline minRows={"2"} maxRows={"4"} id="epic-description" label="Description" variant="outlined" />
                        <FormControl>
                            <InputLabel id="probability-label" error={errorProbability}>Probability</InputLabel>
                            <Select
                                labelId="probability-label"
                                value={probability}
                                label="Probability"
                                error={errorProbability}
                                onChange={(e: any) => setProbability(e.target.value)}
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
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
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

export default CreateRiskDialog;