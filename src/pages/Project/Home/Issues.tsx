import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { getEpicsBySprintId } from '../../../api/services/projectsService';
import { useParams } from 'react-router-dom';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Page from '../../../components/Page/Page';
import AddButton from '../../../components/AddButton/AddButton';
import { Epic } from '../../../api/models/epic';
import { Issue } from '../../../api/models/issue';

const ProjectIssues = () => {
	const { projectId, releaseId, sprintId, epicId } = useParams();
	const [issues, setIssues] = useState<Issue[]>([]);
	
	const getIssues = async () => {
		try {
			if (epicId) {
				let issues = await getEpicsBySprintId(parseInt(epicId));
				setIssues(issues);
				console.log(issues)
				return issues;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const goToIssue = (id: number) => {
		// navigate(`/project/${id}`);
		console.log(id);
	}

	useEffect(() => {  
		getIssues();
    }, []);
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Issues" />
					<AddButton />
				</div>
				<div>
					<table className="w-full mt-[30px]">
						<thead>
							<tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
								<th></th>
								<th className="text-left">Name</th>
								<th className="text-left">Priority</th>
							</tr>
						</thead>
						<tbody>
							{issues.map((issue: Issue) => (
								<tr key={issue.id} onClick={()=> {goToIssue(issue.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
									<td className='w-[30px]'>
										<img className="w-[24px] h-[24px]" src={'/src/assets/icons/user-story-icon.png'} />
									</td>
									<td className="gap-[10px] text-left">
										{issue.name}
									</td>
									<td className="text-left">{issue.priority}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Page>
		</Sidebar>
	)
};

export default ProjectIssues;