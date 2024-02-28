import { useContext } from "react";
import { Issue } from "../../../../../api/models/issue";
import { BacklogContext } from "../../../../../context/BacklogContext";
import { getIssueIcon } from "../../../../../utilities/utilities";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";

interface IssueCardProps {
    issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const { handleOpenInfoIssue, handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);

    return (
        <div>
            <div
                onClick={() => handleOpenInfoIssue(issue)}
                className="w-full flex items-center justify-between p-[5px] border border-primary border-solid rounded-[0.25rem] cursor-pointer"
            >
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
