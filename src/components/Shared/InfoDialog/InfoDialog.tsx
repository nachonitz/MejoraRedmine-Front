import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import SecondaryButton from "../Buttons/SecondaryButton";

interface InfoDialogProps {
    name?: string;
    properties?: { name: string | undefined; value: string | undefined }[];
    open: boolean;
    handleClose: (refresh?: boolean) => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({
    open,
    handleClose,
    name,
    properties,
}) => {
    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <DialogTitle id={name}>{name}</DialogTitle>

                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[15px]">
                        {properties &&
                            properties.length > 0 &&
                            properties.map((property) => (
                                <div className="flex gap-[10px]">
                                    <span className="text-[#202124] text-[16px] font-[500]">
                                        {property?.name}:
                                    </span>
                                    <span className="text-[#202124] text-[16px] font-[400]">
                                        {property?.value}
                                    </span>
                                </div>
                            ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={handleClose}>
                        Close
                    </SecondaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default InfoDialog;
