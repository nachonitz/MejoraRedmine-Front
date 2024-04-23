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
        case "Support":
            return "/src/assets/icons/support-icon.png";
    }
};

export const getIssuePriorityColor = (issuePriority: string) => {
    switch (issuePriority) {
        case "Low":
            return "#B5EAD7";
        case "Normal":
            return "#E2F0CB";
        case "High":
            return "#FFDAc1";
        case "Urgent":
            return "#FFB7B2";
        case "Immediate":
            return "#FF9AA2";
    }
};

export const getPriorityIcon = (issuePriority: string) => {
    switch (issuePriority) {
        case "Low":
            return (
                <Tooltip title="Low Priority">
                    <div>
                        <MdOutlineKeyboardArrowDown className="text-[#B5EAD7] brightness-90 text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "Normal":
            return (
                <Tooltip title="Normal Priority">
                    <div>
                        <VscCircleFilled className="text-[#E2F0CB] brightness-90 text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "High":
            return (
                <Tooltip title="High Priority">
                    <div>
                        <MdKeyboardArrowUp className="text-[#FFDAc1] brightness-90 text-[18px]" />
                    </div>
                </Tooltip>
            );

        case "Urgent":
            return (
                <Tooltip title="Urgent Priority">
                    <div>
                        <MdKeyboardDoubleArrowUp className="text-[#FFB7B2] brightness-90 text-[18px]" />
                    </div>
                </Tooltip>
            );
        case "Immediate":
            return (
                <Tooltip title="Immediate Priority">
                    <div>
                        <AiOutlineExclamation className="text-[#FF9AA2] brightness-90 text-[18px]" />
                    </div>
                </Tooltip>
            );
    }
};

export const getIssueStatusBackgroundColor = (issueStatus: string) => {
    switch (issueStatus) {
        case "New":
            return "#CCCCCC";
        case "In Progress":
            return "#E2F0CB";
        case "Resolved":
            return "#B5EAD7";
        case "Feedback":
            return "#B5EAD7";
        case "Closed":
            return "#B5EAD7";
        case "Rejected":
            return "#FF9AA2";
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
