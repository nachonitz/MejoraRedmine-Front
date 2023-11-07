import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Project } from "../../../api/models/project";
import { Release, ReleaseFilter } from "../../../api/models/release";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { getProjectById } from "../../../api/services/projectsService";
import {
    deleteRelease,
    getReleases,
} from "../../../api/services/releasesService";
import CreateReleaseDialog from "../../../components/Pages/Releases/CreateReleaseDialog/CreateReleaseDialog";
import EditReleaseDialog from "../../../components/Pages/Releases/EditReleaseDialog/EditReleaseDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate, hasAccess } from "../../../lib/utils";
import InfoDialog from "../../../components/Shared/InfoDialog/InfoDialog";

const defaultFilters: ReleaseFilter = {
    page: 1,
    limit: 10,
};

const ProjectReleases = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();
    const [releases, setReleases] = useState<Release[]>([]);
    const [openCreateRelease, setOpenCreateRelease] = useState(false);
    const [openEditRelease, setOpenEditRelease] = useState(false);
    const [openDeleteRelease, setOpenDeleteRelease] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState<Release>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const getProject = useCallback(async () => {
        try {
            if (projectId) {
                const project = await getProjectById(+projectId);
                setProject(project);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const getUserPermissions = useCallback(async () => {
        try {
            if (projectId) {
                const allPermissions = await getMyPermissions();
                const projectPermissions = allPermissions.find(
                    (permission) => permission.projectId === +projectId
                );
                setPermissions(projectPermissions?.roles ?? []);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const getAllReleases = useCallback(async () => {
        try {
            if (projectId) {
                setIsLoading(true);
                const { data } = await getReleases({
                    ...defaultFilters,
                    projectId: +projectId,
                });
                setIsLoading(false);
                setReleases(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const search = async () => {
        try {
            if (projectId) {
                setIsLoading(true);
                const { data } = await getReleases({
                    ...defaultFilters,
                    projectId: +projectId,
                    name: searchText,
                });
                setIsLoading(false);
                setReleases(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const goToRelease = (releaseId: number) => {
        navigate(`/project/${projectId}/release/${releaseId}`);
    };

    const handleCloseCreateRelease = (refresh?: boolean) => {
        setOpenCreateRelease(false);
        if (refresh) {
            getAllReleases();
        }
    };

    const handleCloseEditRelease = (refresh?: boolean) => {
        setOpenEditRelease(false);
        if (refresh) {
            getAllReleases();
        }
        setSelectedRelease(undefined);
    };

    const handleCloseDeleteRelease = (refresh?: boolean) => {
        setOpenDeleteRelease(false);
        if (refresh) {
            getAllReleases();
        }
        setSelectedRelease(undefined);
    };

    useEffect(() => {
        getAllReleases();
        getProject();
        getUserPermissions();
    }, [getAllReleases, getProject, getUserPermissions]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs project={project} />
                {projectId && (
                    <>
                        {hasAccess(permissions, ["add_issues"]) && (
                            <CreateReleaseDialog
                                projectId={+projectId}
                                open={openCreateRelease}
                                handleClose={handleCloseCreateRelease}
                            />
                        )}
                        {selectedRelease &&
                            hasAccess(permissions, [
                                "edit_issues",
                                "delete_issues",
                            ]) && (
                                <>
                                    <EditReleaseDialog
                                        open={openEditRelease}
                                        releaseId={selectedRelease?.id}
                                        handleClose={handleCloseEditRelease}
                                    />
                                    <DeleteDialog
                                        open={openDeleteRelease}
                                        id={selectedRelease?.id}
                                        handleClose={handleCloseDeleteRelease}
                                        deleteFunction={deleteRelease}
                                        name={selectedRelease?.name}
                                    />
                                </>
                            )}
                    </>
                )}
                <div className="flex flex-col">
                    {project && (
                        <PageTitle
                            dialogInfo={{
                                name: project?.name,
                                properties: [
                                    {
                                        name: "Description",
                                        value: project?.description,
                                    },
                                    {
                                        name: "Identifier",
                                        value: project?.identifier,
                                    },
                                    project?.createdAt && {
                                        name: "Created",
                                        value: getFullDate(project?.createdAt),
                                    },
                                ],
                            }}
                            title={project?.name}
                        />
                    )}
                    <div>
                        <span>Description: {project?.description}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 mt-4">
                        <h3 className="text-[22px] text-primary">Releases</h3>
                        <div className="flex gap-x-6">
                            <Searchbar
                                onChange={setSearchText}
                                onSearch={search}
                            />
                            {hasAccess(permissions, ["add_issues"]) && (
                                <PrimaryButton
                                    onClick={() => {
                                        setOpenCreateRelease(true);
                                    }}
                                >
                                    New Release
                                </PrimaryButton>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <table className="w-full mt-[10px]">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th></th>
                                <th className="text-left">Name</th>
                                <th className="text-left">Start date</th>
                                <th className="text-left">End date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {releases.map((release: Release) => (
                                <tr
                                    key={release.id}
                                    onClick={() => {
                                        goToRelease(release.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <img
                                            className="w-[24px] h-[24px]"
                                            src={
                                                "/src/assets/icons/release-icon.png"
                                            }
                                        />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {release.name}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(release.startDate)}
                                    </td>
                                    <td className="text-left">
                                        {getFullDate(release.endDate)}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            {hasAccess(permissions, [
                                                "edit_issues",
                                                "delete_issues",
                                            ]) && (
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedRelease(
                                                            release
                                                        );
                                                        setOpenEditRelease(
                                                            true
                                                        );
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedRelease(
                                                            release
                                                        );
                                                        setOpenDeleteRelease(
                                                            true
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {releases.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <span className="text-center">
                                    There are no releases yet.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectReleases;
