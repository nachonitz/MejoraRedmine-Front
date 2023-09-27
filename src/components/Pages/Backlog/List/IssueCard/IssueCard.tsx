import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import { getIssueIcon } from "../../../../../utilities/utilities";
import { useState } from "react";
import EditIssueDialog from "../../../Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../../Shared/DeleteDialog/DeleteDialog";
import { deleteIssue } from "../../../../../api/services/issuesService";

interface IssueCardProps {
    issue: Issue;
    getIssues: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, getIssues }) => {
    const [openEditIssue, setOpenEditIssue] = useState(false);
    const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue>();

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
        <div>
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
            <div className="w-full flex items-center justify-between p-[10px] border border-primary border-solid rounded-[10px]">
                <div className="flex gap-[2px] items-center">
                    <img
                        className="w-[32px] h-[32px]"
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
        </div>
    );
};

export default IssueCard;
