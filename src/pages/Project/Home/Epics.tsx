import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { getEpicsBySprintId } from '../../../api/services/projectsService';
import { useParams } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Page from '../../../components/Page/Page';
import AddButton from '../../../components/AddButton/AddButton';
import { Epic } from '../../../api/models/epic';

const ProjectEpics = () => {
	const { projectId, releaseId, sprintId } = useParams();
	const [epics, setEpics] = useState<Epic[]>([]);
	
	const getSprints = async () => {
		try {
			if (sprintId) {
				let epics = await getEpicsBySprintId(parseInt(sprintId));
				setEpics(epics);
				console.log(epics)
				return epics;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const goToEpic = (id: number) => {
		// navigate(`/project/${id}`);
		console.log(id);
	}

	useEffect(() => {  
		getSprints();
    }, []);
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Sprints" />
					<AddButton />
				</div>
				<div>
					<table className="w-full mt-[30px]">
						<thead>
							<tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
								<th></th>
								<th className="text-left">Name</th>
								<th className="text-left">Progress</th>
							</tr>
						</thead>
						<tbody>
							{epics.map((epic: Epic) => (
								<tr key={epic.id} onClick={()=> {goToEpic(epic.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
									<td className='w-[30px]'>
										<img className="w-[24px] h-[24px]" src={'/src/assets/icons/epic-icon.png'} />
									</td>
									<td className="gap-[10px] text-left">
										{epic.name}
									</td>
									<td className="text-left">{'0%'}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Page>
		</Sidebar>
	)
};

export default ProjectEpics;