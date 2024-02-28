import {
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
    MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";

import { Issue } from "../api/models/issue";
import { getFullDate } from "../lib/utils";
import { Tooltip } from "@mui/material";
import { AiOutlineExclamation } from "react-icons/ai";

export const getIssueIcon = (issueType: string) => {
    switch (issueType) {
        case "Bug":
            return "/src/assets/icons/bug-icon.png";
        case "Feature":
            return "/src/assets/icons/user-story-icon.png";
        case "Task":
            return "/src/assets/icons/user-story-icon.png";
    }
};

export const getIssuePriorityColor = (issuePriority: string) => {
    switch (issuePriority) {
        case "Low":
            return "#43B000";
        case "Normal":
            return "#FFAA04";
        case "High":
            return "#E80000";
        case "Urgent":
            return "#B90000";
        case "Immediate":
            return "#890000";
    }
};

export const getPriorityIcon = (issuePriority: string) => {
    switch (issuePriority) {
        case "Low":
            return (
                <Tooltip title="Low Priority">
                    <div>
                        <MdOutlineKeyboardArrowDown className="text-[#43B000] text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "Normal":
            return (
                <Tooltip title="Normal Priority">
                    <div>
                        <VscCircleFilled className="text-[#FFAA04] text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "High":
            return (
                <Tooltip title="High Priority">
                    <div>
                        <MdKeyboardArrowUp className="text-[#E80000] text-[18px]" />
                    </div>
                </Tooltip>
            );

        case "Urgent":
            return (
                <Tooltip title="Urgent Priority">
                    <div>
                        <MdKeyboardDoubleArrowUp className="text-[#B90000] text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "Immediate":
            return (
                <Tooltip title="Immediate Priority">
                    <div>
                        <AiOutlineExclamation className="text-[#890000] text-[18px]" />
                    </div>
                </Tooltip>
            );
    }
};

export const getIssueStatusBackgroundColor = (issueStatus: string) => {
    switch (issueStatus) {
        case "New":
            return "#8A8A8A";
        case "In Progress":
            return "#FFAA04";
        case "Resolved":
            return "#086700";
        case "Feedback":
            return "#086700";
        case "Closed":
            return "#086700";
        case "Rejected":
            return "#FF0000";
    }
};

export const getIssueProperties = (issue: Issue) => {
    return [
        {
            name: "Description",
            value: issue?.description,
        },
        {
            name: "Priority",
            value: issue?.priority?.name,
        },
        {
            name: "Status",
            value: issue?.status?.name,
        },
        {
            name: "Tracker",
            value: issue?.tracker?.name,
        },
        {
            name: "Assignee",
            value: `${issue?.assignee?.firstname} ${issue?.assignee?.lastname}`,
        },
        {
            name: "Estimation",
            value: issue?.estimation,
        },
        {
            name: "Created",
            value: getFullDate(issue?.createdAt),
        },
    ];
};
