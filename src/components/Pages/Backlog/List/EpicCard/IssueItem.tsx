import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import {
    getIssueIcon,
    getIssuePriorityColor,
    getIssueStatusBackgroundColor,
} from "../../../../../utilities/utilities";
import { useContext } from "react";
import { BacklogContext } from "../../../../../context/BacklogContext";
import AssignedCircle from "../../../../Shared/AssignedCircle/AssignedCircle";

interface IssueCardProps {
    issue: Issue;
}

const IssueItem: React.FC<IssueCardProps> = ({ issue }) => {
    const { handleOpenInfoIssue, handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);
    return (
        <div
            onClick={() => handleOpenInfoIssue(issue)}
            className="w-full border-t border-primary border-solid px-[20px] py-[5px] cursor-pointer"
        >
            <div className="w-full flex items-center gap-[10px] justify-between">
                <div className="flex gap-[10px] items-center w-full">
                    <div className="flex gap-[2px] items-center w-[25%]">
                        <div className="w-[30px] h-[30px] flex items-center justify-center">
                            <img
                                src={getIssueIcon(issue.tracker.name)}
                                alt="Issue Icon"
                                className="w-[20px] h-[20px]"
                            />
                        </div>
                        <div>
                            <span>{issue.subject}</span>
                        </div>
                    </div>

                    <div className="w-[25%] flex items-center">
                        <div
                            className="w-[120px] text-white flex justify-center items-center rounded-[15px] text-[14px] p-[3px]"
                            style={{
                                backgroundColor: getIssueStatusBackgroundColor(
                                    issue.status.name
                                ),
                            }}
                        >
                            <span>{issue.status.name}</span>
                        </div>
                    </div>

                    <div className="w-[25%]">
                        <div
                            style={{
                                color: getIssuePriorityColor(
                                    issue.priority["name"]
                                ),
                            }}
                        >
                            <span>{issue.priority.name}</span>
                        </div>
                    </div>
                    <div className="w-[25%]">
                        {issue.assignee && (
                            <AssignedCircle
                                firstname={issue.assignee.firstname}
                                lastname={issue.assignee.lastname}
                            />
                        )}
                    </div>
                </div>
                <div className="w-[30px] h-[30px] flex items-center justify-center">
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

export default IssueItem;
