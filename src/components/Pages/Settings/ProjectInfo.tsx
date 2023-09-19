import { TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Project, UpdateProjectDto } from "../../../api/models/project";
import {
    editProject,
    getProjectById,
} from "../../../api/services/projectsService";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import CustomSwitch from "../../../components/Shared/CustomSwitch/CustomSwitch";
import { LoadingIcon } from "../../Shared/Loading/LoadingIcon";

interface Props {
    projectId?: string;
}

export const ProjectInfo = ({ projectId }: Props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState<string | undefined>("");
    const [identifier, setIdentifier] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorIdentifier, setErrorIdentifier] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const handleGetProject = useCallback(() => {
        if (projectId) {
            setLoading(true);
            getProjectById(parseInt(projectId))
                .then((project: Project) => {
                    setName(project.name);
                    setDescription(project.description);
                    setIdentifier(project.identifier);
                    setIsPrivate(!project.isPublic);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [projectId]);

    const clearErrors = () => {
        setErrorName(false);
        setErrorIdentifier(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!name) {
            setErrorName(true);
            errorFound = true;
        }
        if (!identifier) {
            setErrorIdentifier(true);
            errorFound = true;
        }
        return errorFound;
    };

    const handleSubmit = () => {
        clearErrors();
        setLoading(true);
        const errorFound = checkForFieldsErrors();
        if (errorFound || !projectId) {
            return;
        }
        const project: UpdateProjectDto = {
            name: name,
            description: description,
            identifier: identifier,
            isPublic: !isPrivate,
        };
        editProject(+projectId, project)
            .then(() => setLoading(false))
            .catch((error) => {
                setServerErrors(error.messages);
            });
    };

    useEffect(() => {
        if (projectId) {
            handleGetProject();
        }
    }, [projectId, handleGetProject]);

    return (
        <div className="w-full mt-4 flex flex-col gap-5">
            <div className="flex flex-col gap-[20px]">
                <TextField
                    onChange={(e) => setName(e.target.value)}
                    error={errorName}
                    value={name}
                    className="w-full"
                    id="project-name"
                    label="Name"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setIdentifier(e.target.value)}
                    error={errorIdentifier}
                    disabled
                    value={identifier}
                    className="w-full"
                    id="project-identifier"
                    placeholder="project-identifier"
                    label="Identifier"
                    variant="outlined"
                />
                <TextField
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="w-full"
                    multiline
                    minRows={"2"}
                    maxRows={"4"}
                    id="project-description"
                    label="Description"
                    variant="outlined"
                />
                <CustomSwitch
                    value={isPrivate}
                    description="Public projects and their contents are openly available on the network."
                    onClick={setIsPrivate}
                    title="Private"
                />
            </div>
            <div>
                <PrimaryButton onClick={handleSubmit}>
                    {isLoading ? <LoadingIcon /> : "Save"}
                </PrimaryButton>
            </div>
        </div>
    );
};
