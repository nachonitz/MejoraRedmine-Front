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
import { useEffect, useState } from "react";
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
    const [estimations, _setEstimations] = useState<string[]>([
        "XS",
        "S",
        "M",
        "L",
        "XL",
        NOT_ESTIMATED,
    ]);
    const [priorityId, setPriorityId] = useState<string | undefined>(
        filters.priorityId ? filters.priorityId.toString() : undefined
    );
    const [trackerId, setTrackerId] = useState<string | undefined>(
        filters.trackerId ? filters.trackerId.toString() : undefined
    );
    const [statusId, setStatusId] = useState<string | undefined>(
        filters.statusId ? filters.statusId.toString() : undefined
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

    const handleApply = () => {
        setFilters({
            ...filters,
            priorityId: priorityId ? parseInt(priorityId) : undefined,
            trackerId: trackerId ? parseInt(trackerId) : undefined,
            statusId: statusId ? parseInt(statusId) : undefined,
            sprintId: sprintId ? parseInt(sprintId) : undefined,
            releaseId: releaseId ? parseInt(releaseId) : undefined,
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
        };
        fetch();
    }, []);

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
                   {releases?.length > 0 && <FormControl>
                        <InputLabel id="release-label">Release</InputLabel>
                        <Select
                            labelId="release-label"
                            value={releaseId}
                            label="Release"
                            onChange={(e) => setReleaseId(e.target.value)}
                        >
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
                    </FormControl>}
                    {sprints?.length > 0 && <FormControl>
                        <InputLabel id="sprint-label">Sprint</InputLabel>
                        <Select
                            labelId="sprint-label"
                            value={sprintId}
                            label="Sprint"
                            onChange={(e) => setSprintId(e.target.value)}
                        >
                            {sprints &&
                                sprints.map((sprint: Sprint) => (
                                    <MenuItem key={sprint.id} value={sprint.id}>
                                        {sprint.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>}
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
