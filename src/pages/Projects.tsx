import React, { useEffect, useState } from 'react';
import AddButton from '../components/Buttons/AddButton';
import { getProjects } from '../api/services/projectsService';
import { Project } from '../api/models/project';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page/Page';
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import CustomSwitch from '../components/CustomSwitch/CustomSwitch';
 

const Projects = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const navigate = useNavigate();
	const [openCreateProject, setOpenCreateProject] = useState(false);

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

	const handleCloseCreateProject = () => {
		setOpenCreateProject(false);
	}

	useEffect( () => {	
		getAllProjects();
	}, []);
	return(
		<Page>
			<Dialog open={openCreateProject} onClose={handleCloseCreateProject}>
				<div className="w-[400px]">
					<DialogTitle>Create Project</DialogTitle>
					<DialogContent>
						<div className="mt-[5px] flex flex-col gap-[20px]">
							<TextField className="w-full" id="project-name" label="Name" variant="outlined" />
							<CustomSwitch title="Private" />
						</div>
					</DialogContent>
					<DialogActions>
						<SecondaryButton onClick={handleCloseCreateProject}>Close</SecondaryButton>
						<PrimaryButton>Create</PrimaryButton>
					</DialogActions>
				</div>
			</Dialog>
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
							<th className="text-left">Owner</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project: Project) => (
							<tr key={project.id} onClick={()=> {goToProject(project.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
								<td className='w-[30px]'>
									<img className="w-[24px] h-[24px]" src={'/src/assets/icons/project-icon.png'} />
								</td>
								<td className="gap-[10px] text-left">
									{project.name}
								</td>
								<td className="text-left">{getFullDate(project.created_on)}</td>
								<td className="text-left">NO INFO</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Page>
	)
};

export default Projects;