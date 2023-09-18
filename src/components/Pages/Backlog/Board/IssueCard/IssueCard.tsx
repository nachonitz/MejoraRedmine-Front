import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import {
    getIssueIcon,
    getIssuePriorityColor,
} from "../../../../../utilities/utilities";
import { useState } from "react";
import CreateIssueDialog from "../../../Issues/CreateIssueDialog/CreateIssueDialog";
import EditIssueDialog from "../../../Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../../Shared/DeleteDialog/DeleteDialog";
import { deleteIssue } from "../../../../../api/services/issuesService";

interface IssueCardProps {
    issue: Issue;
    getIssues: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, getIssues }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: issue.id });

    const [openEditIssue, setOpenEditIssue] = useState(false);
    const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue>();

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    const handleCloseEditIssue = (refresh?: boolean) => {
        setOpenEditIssue(false);
        if (refresh) {
            getIssues();
        }
        setSelectedIssue(undefined);
    };

    const handleCloseDeleteIssue = (refresh?: boolean) => {
        setOpenDeleteIssue(false);
        if (refresh) {
            getIssues();
        }
        setSelectedIssue(undefined);
    };

    return (
        <div style={style} ref={setNodeRef} {...attributes} {...listeners}>
            {/* <CreateIssueDialog
                projectId={issue.project.id}
                releaseId={issue.release?.id}
                sprintId={issue.sprint?.id}
                epicId={issue.epic?.id}
                open={openCreateIssue}
                handleClose={handleCloseCreateIssue}
            /> */}
            {selectedIssue && (
                <>
                    <EditIssueDialog
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
                    />
                </>
            )}
            <div className="bg-white w-[346px] shadow-userStory p-[4px] box-border flex flex-col gap-[3px] select-none">
                <div className="flex items-center justify-between">
                    <div className="flex gap-[2px] items-center">
                        <img
                            className="w-[24px] h-[24px]"
                            src={getIssueIcon(issue.tracker.name)}
                        />
                        <span className="text-[16px] text-primary">
                            {issue.subject}
                        </span>
                    </div>
                    <div>
                        <SettingsButton
                            onEdit={() => {
                                setSelectedIssue(issue);
                                setOpenEditIssue(true);
                            }}
                            onDelete={() => {
                                setSelectedIssue(issue);
                                setOpenDeleteIssue(true);
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="pl-[5px]">
                        <span
                            style={{
                                color: getIssuePriorityColor(
                                    issue.priority["name"]
                                ),
                            }}
                            className="text-[16px]"
                        >
                            {issue.priority["name"]}
                        </span>
                    </div>
                    <div>
                        <div className="flex justify-center items-center rounded-[50%] h-[28px] w-[28px] bg-[#d9d9d9] cursor-pointer text-[14px] text-primary">
                            <span>
                                {issue.assignee?.firstname[0]}
                                {issue.assignee?.lastname[0]}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
