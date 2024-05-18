import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip } from "@mui/material";
import { useContext } from "react";
import { Issue } from "../../../../../api/models/issue";
import { BacklogContext } from "../../../../../context/BacklogContext";
import {
    getIssueIcon,
    getPriorityIcon,
} from "../../../../../utilities/utilities";
import AssignedCircle from "../../../../Shared/AssignedCircle/AssignedCircle";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";

interface IssueCardProps {
    issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: issue.id });

    const { handleOpenInfoIssue, handleOpenEditIssue, handleOpenDeleteIssue } =
        useContext(BacklogContext);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            onClick={() => handleOpenInfoIssue(issue)}
            style={style}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <div className="bg-white shadow-userStory p-[4px] box-border flex flex-col gap-[3px] select-none">
                <div className="flex items-start justify-between">
                    <div className="flex gap-[2px] items-start pt-1">
                        <img
                            className="w-[24px] h-[24px]"
                            src={getIssueIcon(issue.tracker.name)}
                        />
                        <span className="text-[16px] text-primary">
                            {issue.subject.length > 35 ? (
                                <Tooltip title={issue.subject}>
                                    <span>
                                        {issue.subject.substring(0, 35) + "..."}
                                    </span>
                                </Tooltip>
                            ) : (
                                issue.subject
                            )}
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
                <div className="flex items-center justify-between">
                    <div className="pl-[5px] text-[14px] text-[#444] flex items-center gap-1">
                        <img
                            className="w-[16px] h-[16px]"
                            src="/assets/icons/epic-icon.png"
                        />
                        <span>
                            {issue.epic?.name.length &&
                            issue.epic?.name.length > 15 ? (
                                <Tooltip title={issue.epic?.name}>
                                    <span>
                                        {issue.epic?.name.substring(0, 15) +
                                            "..."}
                                    </span>
                                </Tooltip>
                            ) : (
                                issue.epic?.name
                            )}
                        </span>
                    </div>
                    <div className="flex gap-1 items-center">
                        {getPriorityIcon(issue.priority.name)}
                        {issue.assignee && (
                            <Tooltip
                                title={`Assignee: ${issue.assignee?.firstname} ${issue.assignee?.lastname}`}
                            >
                                <div>
                                    <AssignedCircle
                                        firstname={issue.assignee?.firstname}
                                        lastname={issue.assignee?.lastname}
                                    />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
