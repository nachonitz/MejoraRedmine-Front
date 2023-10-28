import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import { getIssueIcon } from "../../../../../utilities/utilities";
import { useState, useContext } from "react";
import EditIssueDialog from "../../../Issues/EditIssueDialog/EditIssueDialog";
import DeleteDialog from "../../../../Shared/DeleteDialog/DeleteDialog";
import { deleteIssue } from "../../../../../api/services/issuesService";
import { BacklogContext } from "../../../../../context/BacklogContext";

interface IssueCardProps {
    issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const { handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);

    return (
        <div>
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
                            handleOpenEditIssue(issue);
                        }}
                        onDelete={() => {
                            handleOpenDeleteIssue(issue);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
