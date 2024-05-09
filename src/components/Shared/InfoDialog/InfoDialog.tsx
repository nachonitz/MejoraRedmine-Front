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
                                <div
                                    key={property.name}
                                    className="flex flex-col gap-[2px]"
                                >
                                    <div className="font-[500]">
                                        <span className="text-[#202124] text-[16px] font-[500]">
                                            {property?.name || "-"}:
                                        </span>
                                    </div>
                                    <div className="bg-lightblue py-2 px-2 box-border rounded-[0.25rem]">
                                        <span className="text-[#202124] text-[16px] font-[400]">
                                            {property?.value || "-"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </DialogContent>
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={() => handleCloseModal()}>
                            Close
                        </SecondaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default InfoDialog;
