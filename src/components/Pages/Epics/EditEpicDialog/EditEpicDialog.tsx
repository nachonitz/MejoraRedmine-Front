import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
    Enumeration,
    EnumerationType,
} from "../../../../api/models/enumeration";
import { Epic, UpdateEpicDto } from "../../../../api/models/epic";
import { getEnumerations } from "../../../../api/services/enumerationsService";
import { editEpic, getEpicById } from "../../../../api/services/epicsService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { errorToast, successToast } from "../../../Shared/Toast";
import { Release } from "../../../../api/models/release";
import { Sprint } from "../../../../api/models/sprint";
import { getReleases } from "../../../../api/services/releasesService";
import { getSprints } from "../../../../api/services/sprintsService";

interface EditEpicDialogProps {
    epicId: number;
    open: boolean;
    handleClose: (refresh?: boolean) => void;
    projectId: number;
}

const EditEpicDialog: React.FC<EditEpicDialogProps> = ({
    open,
    handleClose,
    epicId,
    projectId,
}) => {
    const [releases, setReleases] = useState<Release[]>([]);
    const [sprints, setSprints] = useState<Sprint[]>([]);
    const [priorities, setPriorities] = useState<Enumeration[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [priorityId, setPriorityId] = useState<string>("");
    const [releaseId, setReleaseId] = useState<string | undefined>("");
    const [sprintId, setSprintId] = useState<string | undefined>("");
    const [errorName, setErrorName] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);
    const [errorPriorityId, setErrorPriorityId] = useState(false);
    const [errorReleaseId, _setErrorReleaseId] = useState(false);
    const [errorSprintId, _setErrorSprintId] = useState(false);
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

    const getAllIssuesPriorities = async () => {
        const { data } = await getEnumerations({
            type: EnumerationType.PRIORITY,
        });
        setPriorities(data);
    };

    const handleGetEpic = useCallback(() => {
        if (epicId) {
            getEpicById(epicId)
                .then((epic: Epic) => {
                    setName(epic.name);
                    setDescription(epic.description);
                    setPriorityId(epic.priority.id.toString());
                    setReleaseId(epic.release?.id.toString() ?? "");
                    setSprintId(epic.sprint?.id.toString() ?? "");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [epicId]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorDescription(false);
        setErrorPriorityId(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!description) {
            setErrorDescription(true);
            errorFound = true;
        }
        if (!priorityId) {
            setErrorPriorityId(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleSubmit = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        setIsLoading(true);
        const epic: UpdateEpicDto = {
            name: name,
            description: description,
            priorityId: +priorityId,
            releaseId: releaseId ? +releaseId : undefined,
            sprintId: sprintId ? +sprintId : undefined,
        };
        editEpic(epicId, epic)
            .then(() => {
                handleCloseModal(true);
                successToast("Epic edited successfully");
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

    const resetState = useCallback(() => {
        setName("");
        setDescription("");
        setPriorityId("");
        clearErrors();
    }, []);

    const handleCloseModal = (refresh?: boolean) => {
        handleClose(refresh);
        resetState();
    };

    useEffect(() => {
        const fetch = async () => {
            resetState();
            await getAllIssuesPriorities();
            if (open && epicId) {
                handleGetEpic();
            }
            getProjectReleases();
        };
        fetch();
    }, [open, epicId, resetState, handleGetEpic]);

    return (
        <Dialog open={open} onClose={() => handleCloseModal()}>
            <div className="w-[600px]">
                <div className="flex items-center justify-between mt-5 pr-6">
                    <DialogTitle>Edit Epic</DialogTitle>
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
                            error={errorDescription}
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
                        <PrimaryButton onClick={handleSubmit}>
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
            </div>
        </Dialog>
    );
};

export default EditEpicDialog;
