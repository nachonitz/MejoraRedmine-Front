import { Issue } from "../../../../../api/models/issue";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import {
    getIssueIcon,
    getIssuePriorityColor,
    getIssueStatusBackgroundColor,
} from "../../../../../utilities/utilities";
import { useState, useRef, useEffect } from "react";

interface IssueCardProps {
    issue: Issue;
    getEpics: () => void;
}

const IssueItem: React.FC<IssueCardProps> = ({ issue }) => {
    return (
        <div className="w-full border-t border-primary border-solid px-[20px] py-[5px]">
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
                        <div className="flex justify-center items-center rounded-[50%] h-[28px] w-[28px] bg-[#d9d9d9] cursor-pointer text-[14px] text-primary">
                            <span>
                                {issue.assignee?.firstname[0]}
                                {issue.assignee?.lastname[0]}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                    <SettingsButton />
                </div>
            </div>
        </div>
    );
};

export default IssueItem;
