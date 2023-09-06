import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, Select, TextField } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { useContext, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createEpic } from "../../../../api/services/epicsService";
import { Epic } from "../../../../api/models/epic";
import { Enumeration } from "../../../../api/models/enumeration";
import { RiDeleteBin6Line } from 'react-icons/ri';
import { uploadFile } from "../../../../api/services/documentsService";
import { UserContext } from "../../../../context/UserContext";
import { Document } from "../../../../api/models/document";

interface UploadDocumentDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId?: string;
    releaseId?: string;
    sprintId?: string;
    categories: Enumeration[];
}

const UploadDocumentDialog: React.FC<UploadDocumentDialogProps> = ( { open, handleClose, projectId, releaseId, sprintId, categories } ) => {
    const { user } = useContext( UserContext );
    const [title, setTitle] = useState("");
    const [documentCategoryId, setDocumentCategoryId] = useState<number | string>("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [errorTitle, setErrorTitle] = useState(false);
	const [errorDocumentCategory, setErrorDocumentCategory] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    const clearErrors = () => {
        setErrorTitle(false);
        setErrorDocumentCategory(false);
        setErrorFile(false);
        setServerErrors([]);
    }

    function handleChangeFile(event: any) {
        setFile(event.target.files[0])
        console.log(event.target.result)
        console.log(event.target.files[0])
    }

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!title) {
            setErrorTitle(true);
            errorFound = true;
        }
        if (!documentCategoryId) {
            setErrorDocumentCategory(true);
            errorFound = true;
        }
        if (!file) {
            setErrorFile(true);
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
        let input = {
            "title": title,
            "documentCategoryId": documentCategoryId,
            "file": file,
            "projectId": projectId,
            "authorId": user?.id,
            "tags": []
        }
        uploadFile(input).then((document: Document) => {
            console.log(document);
            handleCloseModal(true);
        }).catch((error) => {
            console.log(error)
            setServerErrors(error.messages);
        });
    }

    const resetState = () => {
        setTitle("");
        setDocumentCategoryId("");
        setFile(undefined);
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField onChange={(e) => setTitle(e.target.value)} error={errorTitle} className="w-full" id="title" label="Title" variant="outlined" />
                        <FormControl>
                            <InputLabel id="category" error={errorDocumentCategory}>Document Category</InputLabel>
                            <Select
                                labelId="category-label"
                                value={documentCategoryId}
                                label="Document Category"
                                error={errorDocumentCategory}
                                onChange={(e: any) => setDocumentCategoryId(e.target.value)}
                            >
                                { categories && categories.length > 0 && categories.map((category, index) => (
                                    <MenuItem key={index} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                        {!file && <Button variant="contained" component="label">
                            Choose File
                            <input hidden onChange={handleChangeFile} multiple type="file" />
                        </Button>}
                        {file && <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span>{file.name.length > 40 ? file.name.substring(0,39) + "..." : file.name }</span>
                                <span className="text-[#888] text-[14px]">{(file.size/1024).toFixed(2)} kb</span>
                            </div>
                            <div>
                                <IconButton onClick={() => setFile(undefined)} component="label">
                                    <RiDeleteBin6Line/>
                                </IconButton>
                            </div>
                        </div>}
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

export default UploadDocumentDialog;