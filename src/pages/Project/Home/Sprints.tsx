import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { getSprintsByReleaseId } from '../../../api/services/projectsService';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Page from '../../../components/Page/Page';
import AddButton from '../../../components/AddButton/AddButton';
import { Sprint } from '../../../api/models/sprint';

const ProjectSprints = () => {
	const { projectId, releaseId } = useParams();
	const navigate = useNavigate();
	const [sprints, setSprints] = useState<Sprint[]>([]);
	
	const getSprints = async () => {
		try {
			if (releaseId) {
				let sprints = await getSprintsByReleaseId(parseInt(releaseId));
				setSprints(sprints);
				console.log(sprints)
				return sprints;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const goToSprint = (id: number) => {
		navigate(`/project/${projectId}/release/${releaseId}/sprint/${id}}`);
		console.log(id);
	}

	const getFullDate = (date: Date) => {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		return `${month}/${day}/${year}`;
	}

	useEffect(() => {  
		getSprints();
    }, []);
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Epics" />
					<AddButton />
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
							{sprints.map((sprint: Sprint) => (
								<tr key={sprint.id} onClick={()=> {goToSprint(sprint.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
									<td className='w-[30px]'>
										<img className="w-[24px] h-[24px]" src={'/src/assets/icons/sprint-icon.png'} />
									</td>
									<td className="gap-[10px] text-left">
										{sprint.name}
									</td>
									<td className="text-left">{getFullDate(sprint.startDate)}</td>
									<td className="text-left">{getFullDate(sprint.endDate)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Page>
		</Sidebar>
	)
};

export default ProjectSprints;