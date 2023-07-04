import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import SecondaryButton from "../Buttons/SecondaryButton";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useState } from "react";

interface DeleteDialogProps {
    name?: string;
    id?: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    deleteFunction: (id: number) => Promise<any>;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ( { open, handleClose, id, name, deleteFunction } ) => {
    const [serverErrors, setServerErrors] = useState<string[]>([]);


    const clearErrors = () => {
        setServerErrors([]);
    }

    const handleSubmit = () => {
        clearErrors();
        if (id) {
            deleteFunction(id).then((object: any) => {
                handleCloseModal(true);
            }).catch((error: any) => {
                console.log(error)
                setServerErrors(error.messages);
            });
        }
    }

    const resetState = () => {
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[400px]">
                {/* <DialogTitle>Edit Project</DialogTitle> */}
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <span className="text-[#202124] text-[18px] font-[400]">Are you sure you want to delete <span className="font-[500]">{name}</span>?</span>
                        </div>
                        {serverErrors && serverErrors.length > 0 && <div className='mt-2 min-h-[10px] text-left'>
                            {serverErrors.map((error, index) => (<div key={index}>
                                <p className='text-red-700'> { error }</p>
                            </div>))}
                        </div>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={handleClose}>Close</SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>Delete</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    )
}

export default DeleteDialog;