import { useParams } from "react-router-dom";
import IssueCard from "../../../components/Pages/Backlog/IssueCard/IssueCard";
import Page from "../../../components/Shared/Page/Page"
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle"
import Sidebar from "../../../components/Shared/Sidebar/Sidebar"
import { useEffect, useState } from "react";

import { DndContext, closestCorners, DragEndEvent, DragStartEvent, DragOverEvent, DragOverlay, DropAnimation, defaultDropAnimation, useDroppable, useSensors, useSensor, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Issue } from "../../../api/models/issue";
import { getAllIssues } from "../../../api/services/issuesService";
import IssuesColumn from "../../../components/Pages/Backlog/IssuesColumn/IssuesColumn";

export type Column = {
    [name: string]: Issue[];
  };
  

const Backlog = () => {
    const { projectId } = useParams();
    const [issues, setIssues] = useState<Issue[]>([]);
    // const [toDoIssues, setToDoIssues] = useState<Issue[]>([]);
    // const [inProgressIssues, setInProgressIssues] = useState<Issue[]>([]);
    // const [doneIssues, setDoneIssues] = useState<Issue[]>([]);
    const [activeIssueId, setActiveIssueId] = useState<number | null>(null);
    const [columns, setColumns] = useState<Column>(
        {
            "toDo": [],
            "inProgress": [],
            "done": []
        }
    );
    // const [boardSections, setBoardSections] = useState<BoardSectionsType>(initialBoardSections);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        getIssues();
    }, []);

    const getColumn = (id: string) => {
        if (id in columns) {
            return id;
        }

        let column = "";
        
        column = Object.keys(columns).find((key) =>
            columns[key].find((issue) => issue.id.toString() === id)
        ) as string;
        return column;
    }


    const getIssues = async () => {
        try {
            if (projectId) {
                const issues = await getAllIssues(parseInt(projectId));
                setColumns(
                    {
                        "toDo": issues.filter((issue) => issue.status.name === "New"),
                        "inProgress": issues.filter((issue) => issue.status.name === "In Progress"),
                        "done": issues.filter((issue) => issue.status.name === "Resolved")
                    }
                );
                // issues.filter((issue) => issue.status.name === "New"));
                // setInProgressIssues(issues.filter((issue) => issue.status.name === "In Progress"));
                // setDoneIssues(issues.filter((issue) => issue.status.name === "Resolved"));
                setIssues(issues);
                return issues;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveIssueId(active.id as number);
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        let activeColumnName = getColumn(active.id.toString() as string);
        let overColumnName = getColumn(over?.id.toString() as string);
    
        if (!activeColumnName || !overColumnName || activeColumnName === overColumnName) {
          return;
        }

        const activeItems = columns[activeColumnName];
        const overItems = columns[overColumnName];

        const activeIndex = activeItems.findIndex(
            (issue: Issue) => issue.id === active.id
        );

        const overIndex = overItems.findIndex((issue: Issue) => issue.id !== over?.id);
        

        let newActiveColumn = columns[activeColumnName].filter(issue => issue.id !== active.id);
        let newOverColumn = columns[overColumnName].slice(0, overIndex).concat(columns[activeColumnName][activeIndex]).concat(columns[overColumnName].slice(overIndex, columns[overColumnName].length));
        setColumns((column) => ({
            ...column,
            [activeColumnName]: newActiveColumn,
            [overColumnName]: newOverColumn
        }));
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        let activeColumnName = getColumn(active.id.toString() as string);
        let overColumnName = getColumn(over?.id.toString() as string);
    
        if (!activeColumnName || !overColumnName || activeColumnName !== overColumnName) {
          return;
        }
    
        const activeIndex = columns[activeColumnName].findIndex((issue) => issue.id === active.id);
        const overIndex = columns[overColumnName].findIndex((issue) => issue.id === over?.id);
    
        if (activeIndex !== overIndex) {
            setColumns((column) => ({...column, [overColumnName]: arrayMove(
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

    return(
		<Sidebar>
			<Page>
                <PageTitle title="Backlog" />
                <div className="mt-[30px] mb-[10px]">
                    <DndContext
                        collisionDetection={closestCorners}
                        onDragEnd={handleDragEnd}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        sensors={sensors}
                    >
                        <div className="flex gap-7">
                            <IssuesColumn issues={columns.toDo} id="toDo" title="To Do" />
                            <IssuesColumn issues={columns.inProgress} id="inProgress" title="In Progress" />
                            <IssuesColumn issues={columns.done} id="done" title="Done" />
                            <DragOverlay dropAnimation={dropAnimation}>
                                {issue ? <IssueCard key={issue.id} issue={issue} /> : null}
                            </DragOverlay>
                        </div>
                    </DndContext>
                </div>
            </Page>
        </Sidebar>
    );
}

export default Backlog;