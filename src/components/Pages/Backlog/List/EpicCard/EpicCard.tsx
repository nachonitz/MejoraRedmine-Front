import { IconButton } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Epic } from "../../../../../api/models/epic";
import { BacklogContext } from "../../../../../context/BacklogContext";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import IssueItem from "./IssueItem";

interface IssueCardProps {
    epic: Epic;
}

const EpicCard: React.FC<IssueCardProps> = ({ epic }) => {
    const { handleOpenEditEpic, handleOpenDeleteEpic, handleOpenCreateIssue } =
        useContext(BacklogContext);
    const [opened, setOpened] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState("0px");
    const [overflow, setOveflow] = useState<string>("hidden");

    const toggleContent = () => {
        console.log(opened);
        setOpened(!opened);
    };

    function handleChangeOverflow() {
        if (opened) {
            setOveflow("visible");
        } else {
            setOveflow("hidden");
        }
    }

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(
                opened ? `${contentRef.current.scrollHeight}px` : "0px"
            );
            setTimeout(handleChangeOverflow, 200);
        }
    }, [opened]);

    return (
        <div>
            <div className="w-full flex flex-col box-content border border-[#F3F7FF] bg-[#F3F7FF] shadow-userStory border-solid rounded-[0.25rem]">
                <div
                    onClick={toggleContent}
                    className="flex items-center justify-between p-[5px] cursor-pointer select-none rounded-[10px] hover:bg-[#ebf2ff]"
                >
                    <div className="flex gap-[2px] items-center">
                        <img
                            className="w-[32px] h-[32px]"
                            src="/src/assets/icons/epic-icon.png"
                        />
                        <span className="text-[16px] text-primary">
                            {epic.name}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <IconButton
                            onClick={(e) => {
                                e?.stopPropagation();
                                handleOpenCreateIssue(epic);
                            }}
                        >
                            <MdAdd />
                        </IconButton>
                        <SettingsButton
                            onEdit={() => {
                                handleOpenEditEpic(epic);
                            }}
                            onDelete={() => {
                                handleOpenDeleteEpic(epic);
                            }}
                        />
                    </div>
                </div>
                <div
                    className="w-full"
                    ref={contentRef}
                    style={{
                        overflow: opened ? overflow : "hidden",
                        maxHeight: contentHeight,
                        transition: "max-height 0.2s ease-in-out",
                    }}
                >
                    <div className="pt-[5px] pb-[5px]">
                        {epic.issues &&
                            epic.issues.length > 0 &&
                            epic.issues.map((issue) => (
                                <IssueItem key={issue.id} issue={issue} />
                            ))}
                        {epic.issues && epic.issues.length === 0 && (
                            <div className="w-full px-[20px] py-[5px] cursor-pointer flex justify-center text-gray-500">
                                <span>There are no issues yet.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EpicCard;
