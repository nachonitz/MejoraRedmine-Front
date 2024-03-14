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
import { useContext, useEffect, useState } from "react";
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import {
    Issue,
    IssueStatus,
    UpdateIssueDto,
} from "../../../../api/models/issue";
import { Tracker } from "../../../../api/models/tracker";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import {
    editIssue,
    getIssueById,
    getIssuesStatuses,
    getTrackers,
} from "../../../../api/services/issuesService";
import { UserContext } from "../../../../context/UserContext";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";
import { getMemberships } from "../../../../api/services/membershipsService";
import { ProjectMembership } from "../../../../api/models/membership";
import { Release } from "../../../../api/models/release";
import { Sprint } from "../../../../api/models/sprint";
import { Epic } from "../../../../api/models/epic";
import { getReleases } from "../../../../api/services/releasesService";
import { getSprints } from "../../../../api/services/sprintsService";
import { getEpics } from "../../../../api/services/epicsService";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface EditIssueDialogProps {
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    issueId: number;
    projectId: number;
}

const EditIssueDialog: React.FC<EditIssueDialogProps> = ({
    open,
    handleClose,
    issueId,
    projectId,
}) => {
    const { user } = useContext(UserContext);
    const [releases, setReleases] = useState<Release[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [epics, setEpics] = useState<Epic[]>([]);
    const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
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
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [trackerId, setTrackerId] = useState<string>("");
    const [statusId, setStatusId] = useState<string>("");
    const [assigneeId, setAssigneeId] = useState<string>("");
    const [estimation, setEstimation] = useState<string | undefined>("");
    const [releaseId, setReleaseId] = useState<string | undefined>("");
    const [sprintId, setSprintId] = useState<string | undefined>("");
    const [epicId, setEpicId] = useState<string | undefined>("");
    const [endDate, setEndDate] = useState<any>(null);
    const [errorName, setErrorName] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [errorTrackerId, setErrorTrackerId] = useState(false);
    const [errorStatusId, setErrorStatusId] = useState(false);
    const [errorAssigneeId, setErrorAssigneeId] = useState(false);
    const [errorReleaseId, setErrorReleaseId] = useState(false);
    const [errorSprintId, setErrorSprintId] = useState(false);
    const [errorEpicId, setErrorEpicId] = useState(false);
    const [errorEndDate, setErrorEndDate] = useState(false);
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
        if (releaseId) {
            getSprints({
                releaseId: +releaseId,
            }).then(({ data }) => {
                setSprints(data.items);
            });
        }
    }, [releaseId]);

    useEffect(() => {
        if (sprintId) {
            getEpics({
                sprintId: +sprintId,
            }).then(({ data }) => {
                setEpics(data.items);
            });
        }
    }, [sprintId]);

    useEffect(() => {
        const fetch = async () => {
            resetState();
            await getAllIssuesPriorities();
            getAllTrackers();
            getAllIssuesStatuses();
            if (open && issueId) {
                handleGetIssue();
            }
            getAllMemberships();
            getProjectReleases();
        };
        fetch();
    }, [open, issueId, projectId]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorPriorityId(false);
        setErrorTrackerId(false);
        setErrorStatusId(false);
        setErrorAssigneeId(false);
        setServerErrors([]);
    };

    const handleGetIssue = () => {
        if (issueId) {
            getIssueById(issueId)
                .then((issue: Issue) => {
                    console.log(issue);
                    setName(issue.subject);
                    setDescription(issue.description);
                    setPriorityId(issue.priority.id.toString());
                    setEstimation(issue.estimation);
                    setStatusId(issue.status.id.toString());
                    setTrackerId(issue.tracker.id.toString());
                    setAssigneeId(issue.assignee?.id.toString() ?? "");
                    setReleaseId(issue.release?.id.toString() ?? "");
                    setSprintId(issue.sprint?.id.toString() ?? "");
                    setEpicId(issue.epic?.id.toString() ?? "");
                    setEndDate(dayjs(issue?.endDate));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const getAllMemberships = async () => {
        const { data } = await getMemberships({ projectId });
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
        if (
            statusId &&
            statuses.find((x) => x.id === Number(statusId))?.is_closed
        ) {
            if (!endDate || !new Date(endDate).getTime()) {
                setErrorEndDate(true);
                errorFound = true;
            }
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
        const issue: UpdateIssueDto = {
            subject: name,
            description: description,
            priorityId: +priorityId,
            trackerId: +trackerId,
            estimation: estimation,
            statusId: +statusId,
            projectId: +projectId,
            releaseId: releaseId ? +releaseId : undefined,
            sprintId: sprintId ? +sprintId : undefined,
            epicId: epicId ? +epicId : undefined,
            assigneeId: +assigneeId,
        };
        if (
            statusId &&
            statuses.find((x) => x.id === Number(statusId))?.is_closed
        ) {
            issue.endDate = endDate;
        }
        editIssue(issueId, issue)
            .then(() => {
                handleCloseModal(true);
                successToast("Issue edited successfully");
            })
            .catch((error) => {
                console.log(error);
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
        setEstimation("");
        setStatusId("");
        setAssigneeId("");
        clearErrors();
    };

    const handleCloseModal = (refresh?: boolean) => {
        resetState();
        handleClose(refresh);
    };

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <div className="flex items-center justify-between mt-5 pr-6">
                    <DialogTitle>Edit Issue</DialogTitle>
                    <div className="flex gap-2">
                        <FormControl className="w-32">
                            <InputLabel
                                id="release-label"
                                error={errorReleaseId}
                            >
                                Release
                            </InputLabel>
                            <Select
                                labelId="release-label"
                                value={releaseId}
                                label="Release"
                                error={errorReleaseId}
                                onChange={(e) => {
                                    setReleaseId(e.target.value);
                                    setSprintId(undefined);
                                    setEpicId(undefined);
                                }}
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
                        </FormControl>
                        {releaseId && (
                            <FormControl className="w-32">
                                <InputLabel
                                    id="sprint-label"
                                    error={errorSprintId}
                                >
                                    Sprint
                                </InputLabel>
                                <Select
                                    labelId="sprint-label"
                                    value={sprintId}
                                    label="Sprint"
                                    error={errorSprintId}
                                    onChange={(e) => {
                                        setSprintId(e.target.value);
                                        setEpicId(undefined);
                                    }}
                                >
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
                        {sprintId && (
                            <FormControl className="w-32">
                                <InputLabel id="epic-label" error={errorEpicId}>
                                    Epic
                                </InputLabel>
                                <Select
                                    labelId="epic-label"
                                    value={epicId}
                                    label="Epic"
                                    error={errorEpicId}
                                    onChange={(e) => setEpicId(e.target.value)}
                                >
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
                            value={name}
                            className="w-full"
                            id="epic-name"
                            label="Name"
                            variant="outlined"
                        />
                        <TextField
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
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
                                        (user: ProjectMembership) => (
                                            <MenuItem
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.user.firstname +
                                                    " " +
                                                    user.user.lastname}
                                            </MenuItem>
                                        )
                                    )}
                            </Select>
                        </FormControl>
                        {statusId &&
                            statuses.find((x) => x.id === Number(statusId))
                                ?.is_closed && (
                                <DatePicker
                                    onChange={(date) => setEndDate(date)}
                                    slotProps={{
                                        textField: { error: errorEndDate },
                                    }}
                                    value={endDate}
                                    label="End Date"
                                />
                            )}
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
                <DialogActions>
                    <SecondaryButton onClick={handleClose}>
                        Close
                    </SecondaryButton>
                    <PrimaryButton onClick={handleCreate}>
                        {isLoading ? (
                            <CircularProgress
                                sx={{ color: "white", padding: 0 }}
                                size={20}
                            />
                        ) : (
                            "Edit"
                        )}
                    </PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default EditIssueDialog;
