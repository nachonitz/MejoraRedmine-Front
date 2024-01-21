import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Issue } from "../../../../../api/models/issue";
import IssueCard from "../IssueCard/IssueCard";
import { LinearProgress } from "@mui/material";

type BoardSectionProps = {
    id: string;
    title: string;
    issues: Issue[];
    loading: boolean;
};

const IssuesColumn = ({ id, title, issues, loading }: BoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div className="h-[560px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col flex-1 max-w-[500px] gap-6">
            <div className="w-full">
                <span className="text-[16px] text-[#004A8E]">{title}</span>
            </div>
            <div className="w-full">
                {loading ? (
                    <LinearProgress />
                ) : (
                    <SortableContext
                        id={id}
                        items={issues}
                        strategy={verticalListSortingStrategy}
                    >
                        <div
                            className="flex flex-col gap-[6px]"
                            ref={setNodeRef}
                        >
                            {issues &&
                                issues.map((issue: Issue) => (
                                    <IssueCard key={issue.id} issue={issue} />
                                ))}
                        </div>
                    </SortableContext>
                )}
            </div>
        </div>
    );
};

export default IssuesColumn;
