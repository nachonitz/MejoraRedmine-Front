import { useEffect, useState } from "react";
import { IoLockClosed } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Project, ProjectFilter } from "../api/models/project";
import { deleteProject, getProjects } from "../api/services/projectsService";
import CreateProjectDialog from "../components/Pages/Projects/CreateProjectDialog/CreateProjectDialog";
import EditProjectDialog from "../components/Pages/Projects/EditProjectDialog/EditProjectDialog";
import AddButton from "../components/Shared/Buttons/AddButton";
import SettingsButton from "../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../components/Shared/Page/Page";
import { getFullDate, hasAdminAccess } from "../lib/utils";

const defaultFilters: ProjectFilter = {
    page: 1,
    limit: 10,
    order: "id:asc",
};

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const navigate = useNavigate();
    const [openCreateProject, setOpenCreateProject] = useState(false);
    const [openEditProject, setOpenEditProject] = useState(false);
    const [openDeleteProject, setOpenDeleteProject] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project>();

    const getAllProjects = async () => {
        try {
            const { data } = await getProjects(defaultFilters);
            setProjects(data.items);
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const goToProject = (id: number) => {
        navigate(`/project/${id}`);
    };

    const handleCloseEditProject = (refresh?: boolean) => {
        setOpenEditProject(false);
        if (refresh) {
            getAllProjects();
        }
        setSelectedProject(undefined);
    };

    const handleCloseDeleteProject = (refresh?: boolean) => {
        setOpenDeleteProject(false);
        if (refresh) {
            getAllProjects();
        }
        setSelectedProject(undefined);
    };

    const handleCloseCreateProject = (refresh?: boolean) => {
        setOpenCreateProject(false);
        if (refresh) {
            getAllProjects();
        }
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    return (
        <Page>
            {hasAdminAccess() && (
                <>
                    <CreateProjectDialog
                        open={openCreateProject}
                        handleClose={handleCloseCreateProject}
                    />
                    <EditProjectDialog
                        open={openEditProject}
                        projectId={selectedProject?.id}
                        handleClose={handleCloseEditProject}
                    />
                    <DeleteDialog
                        open={openDeleteProject}
                        id={selectedProject?.id}
                        handleClose={handleCloseDeleteProject}
                        deleteFunction={deleteProject}
                        name={selectedProject?.name}
                    />
                </>
            )}
            <div className="text-[26px] text-primary flex gap-[15px] items-center">
                <span>Projects</span>
                {hasAdminAccess() && (
                    <AddButton
                        onClick={() => {
                            setOpenCreateProject(true);
                        }}
                    />
                )}
            </div>
            <div>
                <table className="w-full mt-[30px]">
                    <thead>
                        <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                            <th></th>
                            <th className="text-left">Name</th>
                            <th className="text-left">Created</th>
                            <th className="text-left">Owner</th>
                            <th className="text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project: Project) => (
                            <tr
                                key={project.id}
                                onClick={() => {
                                    goToProject(project.id);
                                }}
                                className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                            >
                                <td className="w-[30px]">
                                    <img
                                        className="w-[24px] h-[24px]"
                                        src={
                                            "/src/assets/icons/project-icon.png"
                                        }
                                    />
                                </td>
                                <td className="text-left">
                                    <div className="gap-[10px] flex items-center">
                                        {project.name}
                                        {!project.isPublic && (
                                            <IoLockClosed className="inline-block text-[18px] text-[#444]" />
                                        )}
                                    </div>
                                </td>
                                <td className="text-left">
                                    {getFullDate(project.createdAt)}
                                </td>
                                <td className="text-left">
                                    {project.owner.firstname}{" "}
                                    {project.owner.lastname}
                                </td>
                                <td className="text-right">
                                    {hasAdminAccess() && (
                                        <div className="flex justify-end">
                                            <SettingsButton
                                                onEdit={() => {
                                                    setSelectedProject(project);
                                                    setOpenEditProject(true);
                                                }}
                                                onDelete={() => {
                                                    setSelectedProject(project);
                                                    setOpenDeleteProject(true);
                                                }}
                                            />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && (
                    <div className="text-[18px] h-[40px] w-full text-center mt-2">
                        <span className="text-center">
                            There are no projects yet
                        </span>
                    </div>
                )}
            </div>
        </Page>
    );
};

export default Projects;
