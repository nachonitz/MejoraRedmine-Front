import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import { Epic } from "../../../../api/models/epic";
import { CreateIssueDto, IssueStatus } from "../../../../api/models/issue";
import { ProjectMembership } from "../../../../api/models/membership";
import { Release } from "../../../../api/models/release";
import { Sprint } from "../../../../api/models/sprint";
import { Tracker } from "../../../../api/models/tracker";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import { getEpicById, getEpics } from "../../../../api/services/epicsService";
import {
    createIssue,
    getIssuesStatuses,
    getTrackers,
} from "../../../../api/services/issuesService";
import { getMemberships } from "../../../../api/services/membershipsService";
import { getReleases } from "../../../../api/services/releasesService";
import { getSprints } from "../../../../api/services/sprintsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";
import { NOT_ESTIMATED } from "../../../../utilities/constants";

interface CreateIssueDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId: string;
    releaseId?: string;
    sprintId?: string;
    epicId?: string;
}

const CreateIssueDialog: React.FC<CreateIssueDialogProps> = ({
    open,
    handleClose,
    projectId,
    releaseId,
    sprintId,
    epicId,
}) => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [epics, setEpics] = useState<Epic[]>([]);
    const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [statuses, setStatuses] = useState<IssueStatus[]>([]);
    const [estimations, _setEstimations] = useState<string[]>([
        "XS",
        "S",
        "M",
        "L",
        "XL",
        NOT_ESTIMATED,
    ]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>();
    const [priorityId, setPriorityId] = useState<string>("");
    const [trackerId, setTrackerId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [assigneeId, setAssigneeId] = useState<string>("");
    const [estimation, setEstimation] = useState<string | undefined>();
    const [selectedReleaseId, setSelectedReleaseId] = useState<
        string | undefined
    >(releaseId);
    const [selectedSprintId, setSelectedSprintId] = useState<
        string | undefined
    >(sprintId);
    const [selectedEpicId, setSelectedEpicId] = useState<string | undefined>(
        epicId
    );
    const [errorName, setErrorName] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [errorTrackerId, setErrorTrackerId] = useState(false);
    const [errorStatusId, setErrorStatusId] = useState(false);
    const [errorAssigneeId, setErrorAssigneeId] = useState(false);
    const [errorSelectedReleaseId, _setErrorSelectedReleaseId] =
        useState(false);
    const [errorSelectedSprintId, _setSelectedErrorSprintId] = useState(false);
    const [errorSelectedEpicId, _setSelectedErrorEpicId] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getProjectReleases = () => {
        getReleases({
            projectId: +projectId,
        }).then(({ data }) => {
            setReleases(data.items);
        });
    };

    useEffect(() => {
        const setIds = async () => {
            if (epicId) {
                if (!sprintId || !releaseId) {
                    const epic = await getEpicById(parseInt(epicId));
                    setSelectedReleaseId(epic.release?.id.toString());
                    setSelectedSprintId(epic.sprint?.id.toString());
                }
            }
        };
        setIds();
    }, [epicId]);

    useEffect(() => {
        if (selectedReleaseId) {
            getSprints({
                releaseId: +selectedReleaseId,
            }).then(({ data }) => {
                setSprints(data.items);
            });
        }
    }, [selectedReleaseId]);

    useEffect(() => {
        if (selectedSprintId) {
            getEpics({
                sprintId: +selectedSprintId,
            }).then(({ data }) => {
                setEpics(data.items);
            });
        }
    }, [selectedSprintId]);

    useEffect(() => {
        const fetch = async () => {
            resetState();
            await getAllIssuesPriorities();
            getAllTrackers();
            getAllIssuesStatuses();
            getAllMemberships();
            getProjectReleases();
        };
        fetch();
    }, []);

    const clearErrors = () => {
        setErrorName(false);
        setErrorPriorityId(false);
        setErrorTrackerId(false);
        setErrorStatusId(false);
        setErrorAssigneeId(false);
        setServerErrors([]);
    };

    const getAllMemberships = async () => {
        const { data } = await getMemberships({
            projectId: parseInt(projectId),
        });
        setMemberships(data.items);
    };

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

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!priorityId || priorityId === "") {
            setErrorPriorityId(true);
            errorFound = true;
        }
        if (!trackerId || trackerId === "") {
            setErrorTrackerId(true);
            errorFound = true;
        }
        if (!statusId || statusId === "") {
            setErrorStatusId(true);
            errorFound = true;
        }
        if (!assigneeId || assigneeId === "") {
            setErrorAssigneeId(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const issue: CreateIssueDto = {
            subject: name,
            description: description,
            priorityId: +priorityId,
            trackerId: +trackerId,
            statusId: +statusId,
            projectId: +projectId,
            releaseId: selectedReleaseId ? +selectedReleaseId : null,
            sprintId: selectedSprintId ? +selectedSprintId : null,
            epicId: selectedEpicId ? +selectedEpicId : null,
            assigneeId: +assigneeId,
            estimation: estimation === NOT_ESTIMATED ? undefined : estimation,
        };
        createIssue(issue)
            .then(() => {
                handleCloseModal(true);
                successToast("Issue created successfully");
            })
            .catch((error) => {
                setServerErrors(error.messages);
                errorToast("Something went wrong");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const resetState = () => {
        setName("");
        setDescription("");
        setPriorityId("");
        setTrackerId("");
        setEstimation(undefined);
        setStatusId("");
        setAssigneeId("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog fullWidth={true} open={open} onClose={() => handleCloseModal()}>
            <div>
                <div className="flex items-center justify-between mt-5 pr-6">
                    <DialogTitle>Create Issue</DialogTitle>
                    <div className="flex gap-2">
                        <FormControl className="w-32">
                            <InputLabel
                                id="release-label"
                                error={errorSelectedReleaseId}
                            >
                                Release
                            </InputLabel>
                            <Select
                                labelId="release-label"
                                value={selectedReleaseId}
                                label="Release"
                                error={errorSelectedReleaseId}
                                onChange={(e) => {
                                    setSelectedReleaseId(e.target.value);
                                    setSelectedSprintId(undefined);
                                    setSelectedEpicId(undefined);
                                }}
                            >
                                <MenuItem value={""}>None</MenuItem>
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
                        {selectedReleaseId && (
                            <FormControl className="w-32">
                                <InputLabel
                                    id="sprint-label"
                                    error={errorSelectedSprintId}
                                >
                                    Sprint
                                </InputLabel>
                                <Select
                                    labelId="sprint-label"
                                    value={selectedSprintId}
                                    label="Sprint"
                                    error={errorSelectedSprintId}
                                    onChange={(e) => {
                                        setSelectedSprintId(e.target.value);
                                        setSelectedEpicId(undefined);
                                    }}
                                >
                                    <MenuItem value={""}>None</MenuItem>
                                    {sprints &&
                                        sprints.map((sprint: Sprint) => (
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
                        {selectedSprintId && (
                            <FormControl className="w-32">
                                <InputLabel
                                    id="epic-label"
                                    error={errorSelectedEpicId}
                                >
                                    Epic
                                </InputLabel>
                                <Select
                                    labelId="epic-label"
                                    value={selectedEpicId}
                                    label="Epic"
                                    error={errorSelectedEpicId}
                                    onChange={(e) =>
                                        setSelectedEpicId(e.target.value)
                                    }
                                >
                                    <MenuItem value={""}>None</MenuItem>
                                    {epics &&
                                        epics.map((epic: Epic) => (
                                            <MenuItem
                                                key={epic.id}
                                                value={epic.id}
                                            >
                                                {epic.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        )}
                    </div>
                </div>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <TextField
                            onChange={(e) => setName(e.target.value)}
                            error={errorName}
                            className="w-full"
                            id="epic-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                            multiline
                            minRows={"2"}
                            maxRows={"4"}
                            id="epic-description"
                            label="Description"
                            variant="outlined"
                        />
                        <FormControl>
                            <InputLabel
                                id="priority-label"
                                error={errorPriorityId}
                            >
                                Priority
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={priorityId}
                                label="Priority"
                                error={errorPriorityId}
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
                            <InputLabel
                                id="priority-label"
                                error={errorTrackerId}
                            >
                                Tracker
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={trackerId}
                                label="Priority"
                                error={errorTrackerId}
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
                            <InputLabel id="priority-label">
                                Estimation
                            </InputLabel>
                            <Select
                                labelId="priority-label"
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
                            <InputLabel
                                id="priority-label"
                                error={errorStatusId}
                            >
                                Status
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={statusId}
                                label="Priority"
                                error={errorStatusId}
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
                        <FormControl>
                            <InputLabel
                                id="priority-label"
                                error={errorAssigneeId}
                            >
                                Assignee
                            </InputLabel>
                            <Select
                                labelId="priority-label"
                                value={assigneeId}
                                label="Assignee"
                                error={errorAssigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                            >
                                {memberships &&
                                    memberships.map(
                                        (membership: ProjectMembership) => (
                                            <MenuItem
                                                key={membership.id}
                                                value={membership.user.id}
                                            >
                                                {membership.user.firstname +
                                                    " " +
                                                    membership.user.lastname}
                                            </MenuItem>
                                        )
                                    )}
                            </Select>
                        </FormControl>
                        {serverErrors && serverErrors.length > 0 && (
                            <div className="mt-2 min-h-[10px] text-left">
                                {serverErrors.map((error, index) => (
                                    <div key={index}>
                                        <p className="text-red-700"> {error}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={() => handleCloseModal()}>
                            Close
                        </SecondaryButton>
                        <PrimaryButton onClick={handleCreate}>
                            {isLoading ? (
                                <CircularProgress
                                    sx={{ color: "white", padding: 0 }}
                                    size={20}
                                />
                            ) : (
                                "Create"
                            )}
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

export default CreateIssueDialog;
