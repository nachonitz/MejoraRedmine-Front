import { IconButton } from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AiFillInfoCircle } from "react-icons/ai";
import InfoDialog from "../../InfoDialog/InfoDialog";
import { useState } from "react";

export interface DialogInfo {
    name: string | undefined;
    properties: {
        name: string | undefined;
        value: string | undefined;
    }[];
}

interface Props {
    title: string;
    goBackTo?: string;
    dialogInfo?: DialogInfo;
}

const PageTitle = ({ title, goBackTo, dialogInfo }: Props) => {
    const [openInfo, setOpenInfo] = useState(false);
    const navigate = useNavigate();

    const handleCloseInfo = () => {
        setOpenInfo(false);
    };
    return (
        <div className="flex">
            <InfoDialog
                name={dialogInfo?.name}
                properties={dialogInfo?.properties}
                open={openInfo}
                handleClose={handleCloseInfo}
            />
            {goBackTo && (
                <IconButton
                    onClick={() => navigate(goBackTo)}
                    style={{
                        color: "#004A8E",
                        marginRight: "10px",
                    }}
                >
                    <IoMdArrowBack />
                </IconButton>
            )}
            <div className="flex items-center gap-[10px]">
                <span className="text-[26px] font-bold text-primary">
                    {title}
                </span>
                {dialogInfo && (
                    <div title="See more information">
                        <AiFillInfoCircle
                            onClick={() => setOpenInfo(true)}
                            className="text-primary text-[20px] cursor-pointer"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageTitle;
