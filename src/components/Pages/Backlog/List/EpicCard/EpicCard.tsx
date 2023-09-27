import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import { getIssueIcon } from "../../../../../utilities/utilities";
import { useState, useRef, useEffect } from "react";
import EditIssueDialog from "../../../Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../../Shared/DeleteDialog/DeleteDialog";
import { deleteIssue } from "../../../../../api/services/issuesService";
import { Epic } from "../../../../../api/models/epic";
import { getIssues } from "../../../../../api/services/issuesService";
import IssueItem from "./IssueItem";

interface IssueCardProps {
    epic: Epic;
    getEpics: () => void;
}

const EpicCard: React.FC<IssueCardProps> = ({ epic, getEpics }) => {
    const [openEditEpic, setOpenEditEpic] = useState(false);
    const [openDeleteEpic, setOpenDeleteEpic] = useState(false);
    const [selectedEpic, setSelectedEpic] = useState<Epic>();
    const [opened, setOpened] = useState<boolean>(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState("0px");
    const [issues, setIssues] = useState<Issue[]>([]);

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

    const handleCloseEditEpic = (refresh?: boolean) => {
        setOpenEditEpic(false);
        if (refresh) {
            getEpics();
        }
        setSelectedEpic(undefined);
    };

    const toggleContent = () => {
        console.log(opened);
        setOpened(!opened);
    };

    const handleCloseDeleteEpic = (refresh?: boolean) => {
        setOpenDeleteEpic(false);
        if (refresh) {
            getEpics();
        }
        setSelectedEpic(undefined);
    };

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(
                opened ? `${contentRef.current.scrollHeight}px` : "0px"
            );
        }
    }, [opened]);

    useEffect(() => {
        getEpicIssues();
    }, []);

    return (
        <div>
            {/* <CreateIssueDialog
                projectId={issue.project.id}
                releaseId={issue.release?.id}
                sprintId={issue.sprint?.id}
                epicId={issue.epic?.id}
                open={openCreateIssue}
                handleClose={handleCloseCreateIssue}
            /> */}
            {selectedEpic && (
                <>
                    {/* <EditIssueDialog
                        open={openEditIssue}
                        issueId={selectedIssue?.id}
                        handleClose={handleCloseEditIssue}
                    />
                    <DeleteDialog
                        open={openDeleteIssue}
                        id={selectedIssue?.id}
                        handleClose={handleCloseDeleteIssue}
                        deleteFunction={deleteIssue}
                        name={selectedIssue?.subject}
                    /> */}
                </>
            )}
            <div className="w-full flex flex-col box-content border border-primary border-solid rounded-[10px] overflow-hidden">
                <div
                    onClick={toggleContent}
                    className="flex items-center justify-between p-[10px] cursor-pointer select-none hover:bg-[#fafafa]"
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
                        // onEdit={() => {
                        //     setSelectedIssue(epic);
                        //     setOpenEditIssue(true);
                        // }}
                        // onDelete={() => {
                        //     setSelectedIssue(epic);
                        //     setOpenDeleteIssue(true);
                        // }}
                        />
                    </div>
                </div>
                <div
                    className="w-full"
                    ref={contentRef}
                    style={{
                        maxHeight: contentHeight,
                        transition: "max-height 0.2s ease-in-out",
                    }}
                >
                    {issues.map((issue) => (
                        <IssueItem issue={issue} getEpics={getEpics} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EpicCard;
