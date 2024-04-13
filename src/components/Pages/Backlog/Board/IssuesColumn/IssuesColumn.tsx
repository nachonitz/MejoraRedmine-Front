import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LinearProgress } from "@mui/material";
import { Issue } from "../../../../../api/models/issue";
import { Column } from "../Board";
import IssueCard from "../IssueCard/IssueCard";

type BoardSectionProps = {
    column: Column;
    loading: boolean;
};

const IssuesColumn = ({ column, loading }: BoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id: column.name,
    });

    return (
        <div className="h-[560px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col flex-1 max-w-[500px] gap-6">
            <div className="w-full">
                <span className="text-[16px] text-[#004A8E]">
                    {column.name}
                </span>
            </div>
            <div className="w-full">
                {loading ? (
                    <LinearProgress />
                ) : (
                    <SortableContext
                        id={column.name}
                        items={column.issues}
                        strategy={verticalListSortingStrategy}
                    >
                        <div
                            className="flex flex-col gap-[6px]"
                            ref={setNodeRef}
                        >
                            {column.issues &&
                                column.issues.map((issue: Issue) => (
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
