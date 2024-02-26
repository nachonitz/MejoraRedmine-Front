import { useParams } from "react-router-dom";
import { Release } from "../../../api/models/release";
import { useEffect, useState } from "react";
import { ComparativeCard } from "./ComparativeCard";
import { PieChartCard } from "./PieChartCard";
import { Issue } from "../../../api/models/issue";
import { Sprint } from "../../../api/models/sprint";
import { MenuItem, Select } from "@mui/material";

interface Props {
    releases: Release[];
    sprints: Sprint[];
    issues: Issue[];
}

const SprintsDashboard = ({ sprints, issues }: Props) => {
    const { projectId } = useParams();
    const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null);
    const [sprintTasksCompleted, setSprintTasksCompleted] = useState<number>(0);
    const [sprintTasksPlanned, setSprintTasksPlanned] = useState<number>(0);
    const [sprintTasksStatuses, setSprintTasksStatuses] = useState<
        {
            id: number;
            value: number;
            label: string;
        }[]
    >([]);

    const setUpDashboardsData = async () => {
        let currentSprint = sprints.find((sprint) => {
            let sprintEndDate = new Date(sprint.endDate);
            let today = new Date();
            let sprintStartDate = new Date(sprint.startDate);
            return sprintEndDate >= today && sprintStartDate <= today;
        });
        setSelectedSprint(currentSprint || null);
        if (currentSprint) {
            setupSprintCharts(currentSprint, issues || []);
        }
    };

    useEffect(() => {
        setUpDashboardsData();
    }, [projectId]);

    const handleSprintChange = (e: any) => {
        let sprint = sprints?.find((sprint) => sprint.id === e.target.value);
        if (sprint) {
            setupSprintCharts(sprint, issues || []);
            setSelectedSprint(sprint);
        }
    };

    const setupSprintCharts = (sprint: Sprint, issues: Issue[]) => {
        if (sprint && issues) {
            let sprintIssues = issues.filter(
                (issue) => issue.sprint?.id === sprint.id
            );
            setSprintTasksCompleted(
                sprintIssues.filter((issue) => issue.status.is_closed).length
            );
            setSprintTasksPlanned(sprintIssues.length);
            let sprintTasksStatuses = sprintIssues.reduce(
                (
                    acc: {
                        [key: number]: {
                            id: number;
                            value: number;
                            label: string;
                        };
                    },
                    issue
                ) => {
                    if (!acc[issue.status.id]) {
                        acc[issue.status.id] = {
                            id: issue.status.id,
                            value: 0,
                            label: issue.status.name,
                        };
                    }
                    acc[issue.status.id].value++;
                    return acc;
                },
                {}
            );
            setSprintTasksStatuses(Object.values(sprintTasksStatuses));
        }
    };

    return (
        <div>
            <div className="mt-5">
                <Select
                    labelId="select-sprint"
                    value={selectedSprint?.id || ""}
                    label="Sprint"
                    onChange={handleSprintChange}
                >
                    {sprints &&
                        sprints.map((sprint: Sprint) => (
                            <MenuItem key={sprint.id} value={sprint.id}>
                                {sprint.name}
                            </MenuItem>
                        ))}
                </Select>
            </div>
            <div className="mt-5 flex gap-5">
                <div>
                    <PieChartCard
                        title="Tasks by status"
                        data={sprintTasksStatuses}
                    />
                </div>
                <div>
                    <ComparativeCard
                        title="Tasks"
                        properties={[
                            {
                                name: "Completed",
                                value: sprintTasksCompleted,
                            },
                            {
                                name: "Planned",
                                value: sprintTasksPlanned,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default SprintsDashboard;
