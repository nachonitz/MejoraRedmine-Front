import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import {
    getIssueIcon,
    getIssuePriorityColor,
    getIssuePriorityTextColor,
    getIssueStatusBackgroundColor,
    getIssueStatusTextColor,
} from "../../../../../utilities/utilities";
import { useContext } from "react";
import { BacklogContext } from "../../../../../context/BacklogContext";
import AssignedCircle from "../../../../Shared/AssignedCircle/AssignedCircle";
import { Tooltip } from "@mui/material";

interface IssueCardProps {
    issue: Issue;
}

const IssueItem: React.FC<IssueCardProps> = ({ issue }) => {
    const { handleOpenInfoIssue, handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);
    return (
        <div className="px-[10px] py-[4px]">
            <div
                onClick={() => handleOpenInfoIssue(issue)}
                className="w-full px-[20px] py-[5px] cursor-pointer bg-white shadow-userStory"
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
                                <span>
                                    {issue.subject.length > 25 ? (
                                        <Tooltip title={issue.subject}>
                                            <span>
                                                {issue.subject.substring(
                                                    0,
                                                    25
                                                ) + "..."}
                                            </span>
                                        </Tooltip>
                                    ) : (
                                        issue.subject
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="w-[25%] flex items-center">
                            <div
                                className="w-[120px] flex justify-center items-center rounded-[15px] text-[14px] p-[3px]"
                                style={{
                                    backgroundColor:
                                        getIssueStatusBackgroundColor(
                                            issue.status.name
                                        ),
                                    color: getIssueStatusTextColor(
                                        issue.status.name
                                    ),
                                }}
                            >
                                <span>{issue.status.name}</span>
                            </div>
                        </div>

                        <div className="w-[25%]">
                            <div
                                className="w-[150px] flex justify-center items-center rounded-[15px] text-[14px] p-[3px] text-center"
                                style={{
                                    background: getIssuePriorityColor(
                                        issue.priority.name
                                    ),
                                    color: getIssuePriorityTextColor(
                                        issue.priority.name
                                    ),
                                }}
                            >
                                <span>{issue.priority.name} Priority</span>
                            </div>
                        </div>
                        <div className="w-[25%]">
                            <div className="flex">
                                {issue.assignee && (
                                    <Tooltip
                                        title={`Assignee: ${issue.assignee?.firstname} ${issue.assignee?.lastname}`}
                                    >
                                        <div>
                                            <AssignedCircle
                                                firstname={
                                                    issue.assignee?.firstname
                                                }
                                                lastname={
                                                    issue.assignee?.lastname
                                                }
                                            />
                                        </div>
                                    </Tooltip>
                                )}
                            </div>
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
        </div>
    );
};

export default IssueItem;
