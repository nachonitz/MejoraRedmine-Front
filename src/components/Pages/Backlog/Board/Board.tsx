import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimation,
    closestCorners,
} from "@dnd-kit/core";
import IssuesColumn from "./IssuesColumn/IssuesColumn";
import IssueCard from "./IssueCard/IssueCard";
import { Issue, IssueStatus } from "../../../../api/models/issue";
import { useEffect, useState } from "react";
import { changeIssueStatus } from "../../../../api/services/issuesService";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

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

    const changeStatus = (issue: Issue, statusId: number) => {
        changeIssueStatus(issue.id, statusId)
            .then((newIssue: Issue) => {
                issue.status.id = newIssue?.status.id;
                issue.status.name = newIssue?.status?.name;
                issue.status.is_closed = newIssue?.status?.is_closed;
                refresh();
            })
            .catch((error) => {
                console.error(error);
            });
    };

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

        const activeIssue = activeColumn.issues[activeIndex];

        const newActiveIssues = columns
            .find((column) => column.name === activeColumnName)
            ?.issues.filter((issue) => issue.id !== active.id) as Issue[];

        const newOverIssues: Issue[] = overColumn.issues
            .slice(0, overIndex)
            .concat([activeColumn.issues[activeIndex]])
            .concat(
                overColumn.issues.slice(overIndex, overColumn.issues.length)
            );

        let newColumns = columns;
        newColumns[activeColumnIndex].issues = newActiveIssues;
        newColumns[overColumnIndex].issues = newOverIssues;

        setColumns(newColumns);

        if (activeIssue) {
            changeStatus(
                activeIssue,
                statuses.find((status) => status.name === overColumnName)
                    ?.id as number
            );
        }
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
                                    issues={column.issues}
                                    id={column.name}
                                    title={column.name}
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
