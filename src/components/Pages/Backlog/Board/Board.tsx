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

export type Column = {
    [name: string]: Issue[];
};

interface BoardProps {
    issues: Issue[];
    statuses: IssueStatus[];
    getIssues: () => void;
}

const Board: React.FC<BoardProps> = ({ issues, statuses, getIssues }) => {
    const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
    const [columns, setColumns] = useState<Column>({
        toDo: [],
        inProgress: [],
        done: [],
    });
    const columnsStatuses = {
        toDo: "New",
        inProgress: "In Progress",
        done: "Resolved",
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        setColumns({
            toDo: issues.filter(
                (issue) => issue.status.name === columnsStatuses.toDo
            ),
            inProgress: issues.filter(
                (issue) => issue.status.name === columnsStatuses.inProgress
            ),
            done: issues.filter(
                (issue) => issue.status.name === columnsStatuses.done
            ),
        });
    }, [issues]);

    const changeStatus = (issue: Issue, statusId: number) => {
        changeIssueStatus(issue.id, statusId)
            .then((newIssue: Issue) => {
                console.log(newIssue);
                issue.status.id = newIssue?.status.id;
                issue.status.name = newIssue?.status?.name;
                issue.status.is_closed = newIssue?.status?.is_closed;
                console.log(issue);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getColumn = (id: string) => {
        if (id in columns) {
            return id;
        }

        let column = "";

        column = Object.keys(columns).find((key) =>
            columns[key].find((issue) => issue.id.toString() === id)
        ) as string;
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

        const activeItems = columns[activeColumnName];
        const overItems = columns[overColumnName];

        const activeIndex = activeItems.findIndex(
            (issue: Issue) => issue.id === active.id
        );
        const activeIssue = activeItems.find(
            (issue: Issue) => issue.id === active.id
        );

        const overIndex = overItems.findIndex(
            (issue: Issue) => issue.id !== over?.id
        );

        const newActiveColumn = columns[activeColumnName].filter(
            (issue) => issue.id !== active.id
        );
        const newOverColumn = columns[overColumnName]
            .slice(0, overIndex)
            .concat(columns[activeColumnName][activeIndex])
            .concat(
                columns[overColumnName].slice(
                    overIndex,
                    columns[overColumnName].length
                )
            );
        setColumns((column) => ({
            ...column,
            [activeColumnName]: newActiveColumn,
            [overColumnName]: newOverColumn,
        }));

        if (activeIssue) {
            changeStatus(
                activeIssue,
                statuses.find(
                    (status) => status.name === columnsStatuses[overColumnName]
                )?.id as number
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

        const activeIndex = columns[activeColumnName].findIndex(
            (issue) => issue.id === active.id
        );
        const overIndex = columns[overColumnName].findIndex(
            (issue) => issue.id === over?.id
        );

        if (activeIndex !== overIndex) {
            setColumns((column) => ({
                ...column,
                [overColumnName]: arrayMove(
                    column[overColumnName],
                    activeIndex,
                    overIndex
                ),
            }));
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
        <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            sensors={sensors}
        >
            <div className="flex gap-7">
                <IssuesColumn
                    issues={columns.toDo}
                    id="toDo"
                    title="To Do"
                    getIssues={getIssues}
                />
                <IssuesColumn
                    issues={columns.inProgress}
                    id="inProgress"
                    title="In Progress"
                    getIssues={getIssues}
                />
                <IssuesColumn
                    issues={columns.done}
                    id="done"
                    title="Done"
                    getIssues={getIssues}
                />
                <DragOverlay dropAnimation={dropAnimation}>
                    {issue ? (
                        <IssueCard
                            key={issue.id}
                            issue={issue}
                            getIssues={getIssues}
                        />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default Board;
