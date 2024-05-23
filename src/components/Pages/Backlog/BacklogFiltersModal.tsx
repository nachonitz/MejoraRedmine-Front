import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import { IssueFilter, IssueStatus } from "../../../api/models/issue";
import PrimaryButton from "../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../Shared/Buttons/SecondaryButton";
import { useCallback, useEffect, useState } from "react";
import { Tracker } from "../../../api/models/tracker";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import {
    getIssuesStatuses,
    getTrackers,
} from "../../../api/services/issuesService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { EpicFilter } from "../../../api/models/epic";
import { getReleases } from "../../../api/services/releasesService";
import { Sprint } from "../../../api/models/sprint";
import { Release } from "../../../api/models/release";
import { NOT_ESTIMATED } from "../../../utilities/constants";
import { getSprints } from "../../../api/services/sprintsService";
import { ListedResponse } from "../../../api/models/common";
import { getMemberships } from "../../../api/services/membershipsService";
import { ProjectMembership } from "../../../api/models/membership";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: IssueFilter & EpicFilter;
    setFilters: (filters: IssueFilter & EpicFilter) => void;
    onClearFilters: () => void;
    projectId: number;
    sprints: Sprint[];
}

export const BacklogFiltersModal = ({
    open,
    onClose,
    filters,
    setFilters,
    onClearFilters,
    projectId,
    sprints,
}: Props) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [releases, setReleases] = useState<Release[]>([]);
    const [sprintsList, setSprintsList] = useState<Sprint[]>([]);
    const [estimations, _setEstimations] = useState<string[]>([
        "XS",
        "S",
        "M",
        "L",
        "XL",
        NOT_ESTIMATED,
    ]);
    const [members, setMembers] = useState<ProjectMembership[]>([]);
    const [priorityId, setPriorityId] = useState<string | undefined>(
        filters.priorityId ? filters.priorityId.toString() : undefined
    );
    const [trackerId, setTrackerId] = useState<string | undefined>(
        filters.trackerId ? filters.trackerId.toString() : undefined
    );
    const [statusId, setStatusId] = useState<string | undefined>(
        filters.statusId ? filters.statusId.toString() : undefined
    );
    const [userId, setUserId] = useState<string | undefined>(
        filters.assigneeId ? filters.assigneeId.toString() : undefined
    );
    const [sprintId, setSprintId] = useState<string | undefined>(
        filters.sprintId ? filters.sprintId.toString() : undefined
    );
    const [releaseId, setReleaseId] = useState<string | undefined>(
        filters.releaseId ? filters.releaseId.toString() : undefined
    );
    const [estimation, setEstimation] = useState<string | undefined>(
        filters.estimation
    );

    const getAllIssuesStatuses = () => {
        getIssuesStatuses()
            .then((statuses: IssueStatus[]) => {
                setStatuses(statuses);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllIssuesPriorities = async () => {
        const { data } = await getEnumerations({
            type: EnumerationType.PRIORITY,
        });
        setPriorities(data);
    };

    const getAllTrackers = () => {
        getTrackers()
            .then((trackers: Tracker[]) => {
                setTrackers(trackers);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getAllReleasesForProject = async () => {
        const { data } = await getReleases({
            projectId: +projectId,
        });
        setReleases(data.items);
    };

    const getAllProjectMembers = async () => {
        const { data } = await getMemberships({
            projectId,
        });
        setMembers(data.items);
    };

    const handleApply = () => {
        setFilters({
            ...filters,
            priorityId: priorityId ? parseInt(priorityId) : undefined,
            trackerId: trackerId ? parseInt(trackerId) : undefined,
            statusId: statusId ? parseInt(statusId) : undefined,
            sprintId: sprintId ? parseInt(sprintId) : undefined,
            releaseId: releaseId ? parseInt(releaseId) : undefined,
            assigneeId: userId ? parseInt(userId) : undefined,
            estimation: estimation,
        });
        onClose();
    };

    useEffect(() => {
        const fetch = async () => {
            await getAllIssuesPriorities();
            await getAllReleasesForProject();
            getAllTrackers();
            getAllIssuesStatuses();
            getAllProjectMembers();
        };
        fetch();
    }, []);

    const handleGetSprints = useCallback(() => {
        if (releaseId) {
            getSprints({
                releaseId: parseInt(releaseId),
                projectId,
                limit: 100,
            })
                .then((value: { data: ListedResponse<Sprint> }) => {
                    const sprints = value.data;
                    setSprintsList(sprints.items);
                    if (sprintId) {
                        const sprint = sprints.items.find(
                            (sprint) => sprint.id === parseInt(sprintId)
                        );
                        if (!sprint) {
                            setSprintId(undefined);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [releaseId]);

    useEffect(() => {
        if (sprints) {
            setSprintsList(sprints);
        }
    }, [sprints]);

    useEffect(() => {
        if (releaseId) {
            handleGetSprints();
        } else {
            setSprintsList(sprints);
        }
    }, [releaseId]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Filters</DialogTitle>
            <DialogContent>
                <div className="mt-[5px] flex flex-col gap-[20px]">
                    <FormControl>
                        <InputLabel id="priority-label">
                            Issue Priority
                        </InputLabel>
                        <Select
                            labelId="priority-label"
                            value={priorityId}
                            label="Issue Priority"
                            onChange={(e) => setPriorityId(e.target.value)}
                        >
                            {priorities &&
                                priorities.map((priority: Enumeration) => (
                                    <MenuItem
                                        key={priority.id}
                                        value={priority.id}
                                    >
                                        {priority.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="tracker-label">
                            Issue Tracker
                        </InputLabel>
                        <Select
                            labelId="tracker-label"
                            value={trackerId}
                            label="Issue Tracker"
                            onChange={(e) => setTrackerId(e.target.value)}
                        >
                            {trackers &&
                                trackers.map((tracker: Tracker) => (
                                    <MenuItem
                                        key={tracker.id}
                                        value={tracker.id}
                                    >
                                        {tracker.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="estimation-label">
                            Issue Estimation
                        </InputLabel>
                        <Select
                            labelId="estimation-label"
                            value={estimation}
                            label="Issue Estimation"
                            onChange={(e) => setEstimation(e.target.value)}
                        >
                            {estimations &&
                                estimations.map((estimation: string) => (
                                    <MenuItem
                                        key={estimation}
                                        value={estimation}
                                    >
                                        {estimation}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="status-label">Issue Status</InputLabel>
                        <Select
                            labelId="status-label"
                            value={statusId}
                            label="Issue Status"
                            onChange={(e) => setStatusId(e.target.value)}
                        >
                            {statuses &&
                                statuses.map((status: IssueStatus) => (
                                    <MenuItem key={status.id} value={status.id}>
                                        {status.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="assignee-label">Assignee</InputLabel>
                        <Select
                            labelId="assignee-label"
                            value={userId}
                            label="Assignee"
                            onChange={(e) => setUserId(e.target.value)}
                        >
                            <MenuItem value={undefined}>All</MenuItem>
                            {members &&
                                members.map((member: ProjectMembership) =>
                                    member.user ? (
                                        <MenuItem
                                            key={member.id}
                                            value={member.id}
                                        >
                                            {`${member.user.firstname} ${member.user.lastname}`}
                                        </MenuItem>
                                    ) : null
                                )}
                        </Select>
                    </FormControl>
                    {releases?.length > 0 && (
                        <FormControl>
                            <InputLabel id="release-label">Release</InputLabel>
                            <Select
                                labelId="release-label"
                                value={releaseId}
                                label="Release"
                                onChange={(e) => setReleaseId(e.target.value)}
                            >
                                <MenuItem value={undefined}>All</MenuItem>
                                {releases &&
                                    releases.map((release: Release) => (
                                        <MenuItem
                                            key={release.id}
                                            value={release.id}
                                        >
                                            {release.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    )}
                    {sprintsList?.length > 0 && (
                        <FormControl>
                            <InputLabel id="sprint-label">Sprint</InputLabel>
                            <Select
                                labelId="sprint-label"
                                value={sprintId}
                                label="Sprint"
                                onChange={(e) => setSprintId(e.target.value)}
                            >
                                <MenuItem value={undefined}>All</MenuItem>
                                {sprintsList &&
                                    sprintsList.map((sprint: Sprint) => (
                                        <MenuItem
                                            key={sprint.id}
                                            value={sprint.id}
                                        >
                                            {sprint.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    )}
                </div>
            </DialogContent>
            <div className="px-4 mb-4">
                <DialogActions>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <SecondaryButton
                        onClick={() => {
                            onClearFilters();
                            onClose();
                        }}
                    >
                        Clear Filters
                    </SecondaryButton>
                    <PrimaryButton onClick={handleApply} className="h-[50px]">
                        Apply
                    </PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
