import { useContext, useEffect, useRef, useState } from "react";
import { Epic } from "../../../../../api/models/epic";
import { Issue } from "../../../../../api/models/issue";
import { getIssues } from "../../../../../api/services/issuesService";
import { BacklogContext } from "../../../../../context/BacklogContext";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import IssueItem from "./IssueItem";
import { IconButton } from "@mui/material";
import { MdAdd } from "react-icons/md";

interface IssueCardProps {
    epic: Epic;
}

const EpicCard: React.FC<IssueCardProps> = ({ epic }) => {
    const { handleOpenEditEpic, handleOpenDeleteEpic, handleOpenCreateIssue } =
        useContext(BacklogContext);
    const [opened, setOpened] = useState<boolean>(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState("0px");
    const [issues, setIssues] = useState<Issue[]>([]);
    const [overflow, setOveflow] = useState<string>("hidden");

    const getEpicIssues = async () => {
        try {
            if (epic.id) {
                const { data: issues } = await getIssues({
                    epicId: epic.id,
                });
                setIssues(issues.items);
                return issues;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

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

    useEffect(() => {
        getEpicIssues();
    }, [epic]);

    return (
        <div>
            <div className="w-full flex flex-col box-content border border-primary border-solid rounded-[0.25rem]">
                <div
                    onClick={toggleContent}
                    className="flex items-center justify-between p-[5px] cursor-pointer select-none rounded-[10px] hover:bg-[#fafafa]"
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
                        // height: contentHeight,
                        // display: opened ? "block" : "none",
                        overflow: opened ? overflow : "hidden",
                        maxHeight: contentHeight,
                        transition: "max-height 0.2s ease-in-out",
                    }}
                >
                    {issues &&
                        issues.length > 0 &&
                        issues.map((issue) => <IssueItem issue={issue} />)}
                    {issues && issues.length === 0 && (
                        <div className="w-full border-t border-primary border-solid px-[20px] py-[5px] cursor-pointer flex justify-center">
                            <span>There are no issues yet.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EpicCard;
