import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Issue } from '../../../../api/models/issue';
import IssueCard from '../IssueCard/IssueCard';

type BoardSectionProps = {
    id: string;
    title: string;
    issues: Issue[];
};

const IssuesColumn = ({ id, title, issues }: BoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div key={"inProgress"} className="h-[560px] w-[364px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col gap-6">
            <div>
                <span className="text-[16px] text-[#004A8E]">{title}</span>
            </div>
            <SortableContext
                id={id}
                items={issues}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-[6px]" ref={setNodeRef}>
                    { issues && issues.map((issue: Issue) => ( <IssueCard key={issue.id} issue={issue} /> )) }
                </div>
            </SortableContext>
        </div>
    );
};

export default IssuesColumn;
