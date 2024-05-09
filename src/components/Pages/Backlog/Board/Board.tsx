import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    defaultDropAnimation,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { Issue, IssueStatus } from "../../../../api/models/issue";
import { editIssue } from "../../../../api/services/issuesService";
import IssueCard from "./IssueCard/IssueCard";
import IssuesColumn from "./IssuesColumn/IssuesColumn";

export interface Column {
    name: string;
    issues: Issue[];
}

interface BoardProps {
    issues: Issue[];
    statuses: IssueStatus[];
    refresh: () => void;
    loading: boolean;
}

const Board = ({ issues, statuses, refresh, loading }: BoardProps) => {
    const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setColumns(
            statuses.map((status) => ({
                name: status.name,
                issues: issues.filter(
                    (issue) => issue.status.name === status.name
                ),
            }))
        );
    }, [issues]);

    const getColumn = (id: string) => {
        if (columns.find((column) => column.name === id)) {
            return id;
        }

        let column = "";

        column = columns.find((column) =>
            column.issues.find((issue) => issue.id.toString() === id)
        )?.name as string;

        return column;
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveIssueId(active.id as number);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        const activeColumnName: string = getColumn(
            active.id.toString() as string
        );
        const overColumnName: string = getColumn(over?.id.toString() as string);

        if (
            !activeColumnName ||
            !overColumnName ||
            activeColumnName === overColumnName
        ) {
            return;
        }

        const activeColumnIndex = columns.findIndex(
            (column) => column.name === activeColumnName
        );
        const overColumnIndex = columns.findIndex(
            (column) => column.name === overColumnName
        );
        const activeColumn = columns[activeColumnIndex] as Column;
        const overColumn = columns[overColumnIndex] as Column;

        const activeIndex = activeColumn.issues.findIndex(
            (issue: Issue) => issue.id === active.id
        );

        const overIndex = overColumn.issues.findIndex(
            (issue: Issue) => issue.id !== over?.id
        );

        const newActiveIssues = columns
            .find((column) => column.name === activeColumnName)
            ?.issues.filter((issue) => issue.id !== active.id) as Issue[];

        const newOverIssues: Issue[] = overColumn.issues
            .slice(0, overIndex)
            .concat([activeColumn.issues[activeIndex]])
            .concat(
                overColumn.issues.slice(overIndex, overColumn.issues.length)
            );

        const newColumns = columns;
        newColumns[activeColumnIndex].issues = newActiveIssues;
        newColumns[overColumnIndex].issues = newOverIssues;

        setColumns(newColumns);
    };

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        const activeColumnName = getColumn(active.id.toString() as string);
        const overColumnName = getColumn(over?.id.toString() as string);

        if (
            !activeColumnName ||
            !overColumnName ||
            activeColumnName !== overColumnName
        ) {
            return;
        }

        const activeColumnIndex = columns.findIndex(
            (column) => column.name === activeColumnName
        );
        const overColumnIndex = columns.findIndex(
            (column) => column.name === overColumnName
        );

        const activeColumn = columns[activeColumnIndex] as Column;
        const overColumn = columns[overColumnIndex] as Column;

        const activeIndex = activeColumn.issues.findIndex(
            (issue) => issue.id === active.id
        );
        const overIndex = overColumn.issues.findIndex(
            (issue) => issue.id === over?.id
        );

        const newColumns = columns;
        newColumns[overColumnIndex] = {
            ...newColumns[overColumnIndex],
            issues: arrayMove(
                newColumns[overColumnIndex].issues,
                activeIndex,
                overIndex
            ),
        };

        setColumns(newColumns);

        const activeIssue = activeColumn.issues[activeIndex];
        const newSortIndex = newColumns[overColumnIndex].issues.findIndex(
            (issue) => issue.id === activeIssue.id
        );
        const realSortIndex = overColumn.issues[newSortIndex].sortIndex;

        if (activeIssue.status.name !== overColumnName) {
            editIssue(activeIssue.id, {
                sortIndex: Math.max(newSortIndex, realSortIndex),
                statusId: statuses.find(
                    (status) => status.name === overColumnName
                )?.id as number,
            })
                .then(() => refresh())
                .catch((error) => console.error(error));
        } else {
            editIssue(activeIssue.id, {
                sortIndex: realSortIndex,
            });
        }

        setActiveIssueId(null);
    };

    const getIssueById = (id: number) => {
        return issues.find((issue) => issue.id === id);
    };

    const dropAnimation: DropAnimation = {
        ...defaultDropAnimation,
    };

    const issue = activeIssueId ? getIssueById(activeIssueId) : null;

    return (
        <div className="flex w-full">
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                sensors={sensors}
            >
                <div className="w-full flex gap-4">
                    {columns &&
                        columns.map((column) => {
                            return (
                                <IssuesColumn
                                    key={column.name}
                                    column={column}
                                    loading={loading}
                                />
                            );
                        })}
                    <DragOverlay dropAnimation={dropAnimation}>
                        {issue ? (
                            <IssueCard key={issue.id} issue={issue} />
                        ) : null}
                    </DragOverlay>
                </div>
            </DndContext>
        </div>
    );
};

export default Board;
