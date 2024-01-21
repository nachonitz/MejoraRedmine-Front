import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext } from "react";
import { Issue } from "../../../../../api/models/issue";
import { BacklogContext } from "../../../../../context/BacklogContext";
import {
    getIssueIcon,
    getIssuePriorityColor,
} from "../../../../../utilities/utilities";
import SettingsButton from "../../../../Shared/Buttons/SettingsButton";
import AssignedCircle from "../../../../Shared/AssignedCircle/AssignedCircle";

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
                <div className="flex items-center justify-between">
                    <div className="flex gap-[2px] items-center">
                        <img
                            className="w-[24px] h-[24px]"
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
                <div className="flex items-center justify-between">
                    <div className="pl-[5px]">
                        <span
                            style={{
                                color: getIssuePriorityColor(
                                    issue.priority["name"]
                                ),
                            }}
                            className="text-[16px]"
                        >
                            {issue.priority["name"]}
                        </span>
                    </div>
                    <div>
                        {issue.assignee && (
                            <AssignedCircle
                                firstname={issue.assignee?.firstname}
                                lastname={issue.assignee?.lastname}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
