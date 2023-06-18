import React, { useEffect, useState } from 'react';
import AddButton from '../components/AddButton/AddButton';
import { getProjects } from '../api/services/projectsService';
import { Project } from '../api/models/project';

const Projects = () => {
	const [projects, setProjects] = useState<Project[]>([]);

	const getAllProjects = async () => {
		try {
			let projects = await getProjects();
			setProjects(projects);
			return projects;
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const getFullDate = (date: Date) => {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		return `${month}/${day}/${year}`;
	}

	useEffect( () => {	
		getAllProjects();
	}, []);
	return(
		<div className='p-page mt-10 box-border w-full'>
			<div className="text-[26px] text-primary flex gap-[15px]">
				<span>Projects</span>
				<AddButton />
			</div>
			<div>
				<table className="w-full mt-[30px]">
					<thead>
						<tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
							<th className="text-left">Name</th>
							<th className="text-left">Created</th>
							<th className="text-left">Owner</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project: Project) => (
							<tr key={project.id} className="text-[18px] h-[40px]">
								<td className="text-left">{project.name}</td>
								<td className="text-left">{getFullDate(project.created_on)}</td>
								<td className="text-left">NO INFO</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="h-[100vh]">
				HOLAAAA
			</div>
		</div>
	)
};

export default Projects;