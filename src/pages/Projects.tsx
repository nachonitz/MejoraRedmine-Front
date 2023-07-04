import React, { useEffect, useState } from 'react';
import AddButton from '../components/Buttons/AddButton';
import { deleteProject, getProjects } from '../api/services/projectsService';
import { Project } from '../api/models/project';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page/Page';
import { IoLockClosed } from 'react-icons/io5';
import CreateProjectDialog from '../components/CreateProjectDialog/CreateProjectDialog';
import SettingsButton from '../components/Buttons/SettingsButton';
import EditProjectDialog from '../components/EditProjectDialog/EditProjectDialog';
import DeleteDialog from '../components/DeleteDialog/DeleteDialog';
 

const Projects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const navigate = useNavigate();
	const [openCreateProject, setOpenCreateProject] = useState(false);
	const [openEditProject, setOpenEditProject] = useState(false);
	const [openDeleteProject, setOpenDeleteProject] = useState(false);
	const [selectedProject, setSelectedProject] = useState<Project>();


	const getAllProjects = async () => {
		try {
			let projects = await getProjects();
			setProjects(projects);
			return projects;
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const goToProject = (id: number) => {
		navigate(`/project/${id}`);
	}

	const getFullDate = (date: Date) => {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		return `${month}/${day}/${year}`;
	}

	const handleCloseEditProject = (refresh?: boolean) => {
		setOpenEditProject(false);
		if (refresh) {
			getAllProjects();
		}
		setSelectedProject(undefined);
	}

	const handleCloseDeleteProject = (refresh?: boolean) => {
		setOpenDeleteProject(false);
		if (refresh) {
			getAllProjects();
		}
		setSelectedProject(undefined);
	}

	const handleCloseCreateProject = (refresh?: boolean) => {
		setOpenCreateProject(false);
		if (refresh) {
			getAllProjects();
		}
	}

	useEffect( () => {	
		getAllProjects();
	}, []);
	return(
		<Page>
			<CreateProjectDialog open={openCreateProject} handleClose={handleCloseCreateProject} />
			<EditProjectDialog open={openEditProject} projectId={selectedProject?.id} handleClose={handleCloseEditProject} />
			<DeleteDialog open={openDeleteProject} id={selectedProject?.id} handleClose={handleCloseDeleteProject} deleteFunction={deleteProject} name={selectedProject?.name} />
			<div className="text-[26px] text-primary flex gap-[15px] items-center">
				<span>Projects</span>
				<AddButton onClick={ ()=> { setOpenCreateProject(true) }} />
			</div>
			<div>
				<table className="w-full mt-[30px]">
					<thead>
						<tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
							<th></th>
							<th className="text-left">Name</th>
							<th className="text-left">Created</th>
							<th className="text-right"></th>
							{/* <th className="text-left">Owner</th> */}
						</tr>
					</thead>
					<tbody>
						{projects.map((project: Project) => (
							<tr key={project.id} onClick={()=> {goToProject(project.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
								<td className='w-[30px]'>
									<img className="w-[24px] h-[24px]" src={'/src/assets/icons/project-icon.png'} />
								</td>
								<td className="text-left">
									<div className="gap-[10px] flex items-center">
										{project.name}
										{ !project.is_public && <IoLockClosed className="inline-block text-[18px] text-[#444]" />}
									</div>
								</td>
								<td className="text-left">{getFullDate(project.created_on)}</td>
								<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedProject(project); setOpenEditProject(true) }} onDelete={()=> { setSelectedProject(project); setOpenDeleteProject(true)}} /></div></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Page>
	)
};

export default Projects;