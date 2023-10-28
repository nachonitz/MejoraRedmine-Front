import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import { getIssueIcon } from "../../../../../utilities/utilities";
import { useState, useRef, useEffect, useContext } from "react";
import EditIssueDialog from "../../../Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../../Shared/DeleteDialog/DeleteDialog";
import { deleteIssue } from "../../../../../api/services/issuesService";
import { Epic } from "../../../../../api/models/epic";
import { getIssues } from "../../../../../api/services/issuesService";
import IssueItem from "./IssueItem";
import { BacklogContext } from "../../../../../context/BacklogContext";

interface IssueCardProps {
    epic: Epic;
}

const EpicCard: React.FC<IssueCardProps> = ({ epic }) => {
    const { handleOpenEditEpic, handleOpenDeleteEpic } =
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
            <div className="w-full flex flex-col box-content border border-primary border-solid rounded-[10px]">
                <div
                    onClick={toggleContent}
                    className="flex items-center justify-between p-[10px] cursor-pointer select-none rounded-[10px] hover:bg-[#fafafa]"
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
                    <div>
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
                    {issues.map((issue) => (
                        <IssueItem issue={issue} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EpicCard;
