import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Project } from "../../../api/models/project";
import { Release } from "../../../api/models/release";
import {
    getProjectById,
    getReleasesByProjectId,
} from "../../../api/services/projectsService";
import { deleteRelease } from "../../../api/services/releasesService";
import CreateReleaseDialog from "../../../components/Pages/Releases/CreateReleaseDialog/CreateReleaseDialog";
import EditReleaseDialog from "../../../components/Pages/Releases/EditReleaseDialog/EditReleaseDialog";
import AddButton from "../../../components/Shared/Buttons/AddButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate } from "../../../lib/utils";

const ProjectReleases = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();
    const [releases, setReleases] = useState<Release[]>([]);
    const [openCreateRelease, setOpenCreateRelease] = useState(false);
    const [openEditRelease, setOpenEditRelease] = useState(false);
    const [openDeleteRelease, setOpenDeleteRelease] = useState(false);
    const [selectedRelease, setSelectedRelease] = useState<Release>();

    const getProject = useCallback(async () => {
        try {
            if (projectId) {
                const project = await getProjectById(parseInt(projectId));
                setProject(project);
                console.log(project);
                return project;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const getReleases = useCallback(async () => {
        try {
            if (projectId) {
                const releases = await getReleasesByProjectId(
                    parseInt(projectId)
                );
                setReleases(releases);
                console.log(releases);
                return releases;
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const goToRelease = (releaseId: number) => {
        navigate(`/project/${projectId}/release/${releaseId}`);
        console.log(projectId);
    };

    const handleCloseCreateRelease = (refresh?: boolean) => {
        setOpenCreateRelease(false);
        if (refresh) {
            getReleases();
        }
    };

    const handleCloseEditRelease = (refresh?: boolean) => {
        setOpenEditRelease(false);
        if (refresh) {
            getReleases();
        }
        setSelectedRelease(undefined);
    };

    const handleCloseDeleteRelease = (refresh?: boolean) => {
        setOpenDeleteRelease(false);
        if (refresh) {
            getReleases();
        }
        setSelectedRelease(undefined);
    };

    useEffect(() => {
        getReleases();
        getProject();
    }, [getReleases, getProject]);

    return (
        <Sidebar>
            <Page>
                <ProjectBreadcrumbs project={project} />
                <CreateReleaseDialog
                    projectId={projectId}
                    open={openCreateRelease}
                    handleClose={handleCloseCreateRelease}
                />
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
                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Releases" />
                    <AddButton
                        onClick={() => {
                            setOpenCreateRelease(true);
                        }}
                    />
                </div>
                <div>
                    <table className="w-full mt-[30px]">
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
                                            <SettingsButton
                                                onEdit={() => {
                                                    setSelectedRelease(release);
                                                    setOpenEditRelease(true);
                                                }}
                                                onDelete={() => {
                                                    setSelectedRelease(release);
                                                    setOpenDeleteRelease(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {releases.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            <span className="text-center">
                                There are no releases yet
                            </span>
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default ProjectReleases;
