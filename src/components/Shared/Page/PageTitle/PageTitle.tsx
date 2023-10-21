import { IconButton } from "@mui/material";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface Props {
    title: string;
    goBackTo?: string;
}

const PageTitle = ({ title, goBackTo }: Props) => {
    const navigate = useNavigate();
    return (
        <div className="flex">
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
            <span className="text-[26px] text-primary">{title}</span>
        </div>
    );
};

export default PageTitle;
