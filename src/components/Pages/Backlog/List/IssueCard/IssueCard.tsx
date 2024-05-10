import { useContext } from "react";
import { Issue } from "../../../../../api/models/issue";
import { BacklogContext } from "../../../../../context/BacklogContext";
import {
    getIssueIcon,
    getIssuePriorityColor,
    getIssuePriorityTextColor,
    getIssueStatusBackgroundColor,
    getIssueStatusTextColor,
} from "../../../../../utilities/utilities";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import { Tooltip } from "@mui/material";
import AssignedCircle from "../../../../Shared/AssignedCircle/AssignedCircle";

interface IssueCardProps {
    issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const { handleOpenInfoIssue, handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);

    return (
        <div>
            <div className="w-full flex flex-col box-content border border-[#F3F7FF] bg-[#F3F7FF] shadow-userStory border-solid rounded-[0.25rem]">
                <div
                    onClick={() => handleOpenInfoIssue(issue)}
                    className="flex items-center justify-between p-[5px] cursor-pointer select-none rounded-[10px] hover:bg-[#ebf2ff]"
                >
                    <div className="w-full flex items-center gap-[10px] justify-between">
                        <div className="flex gap-[10px] items-center w-full">
                            <div className="flex gap-[2px] items-center w-[25%]">
                                <img
                                    src={getIssueIcon(issue.tracker.name)}
                                    alt="Issue Icon"
                                    className="w-[32px] h-[32px]"
                                />
                                <span className="text-[16px] text-primary">
                                    {issue.subject}
                                </span>
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
                                                        issue.assignee
                                                            ?.firstname
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
                    {/* <div className="flex gap-[2px] items-center">
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
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
