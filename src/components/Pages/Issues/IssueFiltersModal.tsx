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

interface Props {
    open: boolean;
    onClose: () => void;
    filters: IssueFilter;
    setFilters: (filters: IssueFilter) => void;
    onClearFilters: () => void;
}

export const IssueFiltersModal = ({
    open,
    onClose,
    filters,
    setFilters,
    onClearFilters,
}: Props) => {
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [estimations, setEstimations] = useState<string[]>([
        "XS",
        "S",
        "M",
        "L",
        "XL",
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

    const handleApply = () => {
        setFilters({
            ...filters,
            priorityId: priorityId ? parseInt(priorityId) : undefined,
            trackerId: trackerId ? parseInt(trackerId) : undefined,
            statusId: statusId ? parseInt(statusId) : undefined,
            estimation: estimation,
        });
        onClose();
    };

    useEffect(() => {
        const fetch = async () => {
            await getAllIssuesPriorities();
            getAllTrackers();
            getAllIssuesStatuses();
        };
        fetch();
    }, []);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[600px]">
                <DialogTitle>Filter issues</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <FormControl>
                            <InputLabel id="priority-label">
                                Priority
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priorityId}
                                label="Priority"
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
                            <InputLabel id="tracker-label">Tracker</InputLabel>
                            <Select
                                labelId="tracker-label"
                                value={trackerId}
                                label="Tracker"
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
                                Estimation
                            </InputLabel>
                            <Select
                                labelId="estimation-label"
                                value={estimation}
                                label="Estimation"
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
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusId}
                                label="Status"
                                onChange={(e) => setStatusId(e.target.value)}
                            >
                                {statuses &&
                                    statuses.map((status: IssueStatus) => (
                                        <MenuItem
                                            key={status.id}
                                            value={status.id}
                                        >
                                            {status.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
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
