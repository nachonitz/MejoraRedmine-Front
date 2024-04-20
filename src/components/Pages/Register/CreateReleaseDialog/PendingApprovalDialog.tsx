import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { PiClockClockwiseFill } from "react-icons/pi";

interface PendingApprovalDialogDialogProps {
    open: boolean;
}

const PendingApprovalDialogDialog = ({
    open,
}: PendingApprovalDialogDialogProps) => {
    const navigate = useNavigate();
    const handleCloseModal = () => {
        navigate("/login");
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[500px]">
                <DialogTitle>Pending Approval</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex gap-[10px] justify-center items-center">
                        <PiClockClockwiseFill className="text-primary text-[55px]" />
                        <div>
                            <span className="text-[18px]">
                                Your account was created and is now pending
                                administrator approval.
                            </span>
                        </div>
                    </div>
                </DialogContent>
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={handleCloseModal}>
                            Close
                        </SecondaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default PendingApprovalDialogDialog;
