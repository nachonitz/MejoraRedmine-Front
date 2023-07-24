import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getIssuesByEpicId, getProjectById } from '../../../api/services/projectsService';
import { useParams } from 'react-router-dom';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import AddButton from '../../../components/Shared/Buttons/AddButton';
import { Epic } from '../../../api/models/epic';
import { Issue } from '../../../api/models/issue';
import DeleteDialog from '../../../components/Shared/DeleteDialog/DeleteDialog';
import { deleteIssue } from '../../../api/services/issuesService';
import SettingsButton from '../../../components/Shared/Buttons/SettingsButton';
import { getEpicById } from '../../../api/services/epicsService';
import { getSprintById } from '../../../api/services/sprintsService';
import { getReleaseById } from '../../../api/services/releasesService';
import { Project } from '../../../api/models/project';
import { Release } from '../../../api/models/release';
import { Sprint } from '../../../api/models/sprint';
import ProjectBreadcrumbs from '../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs';

const ProjectIssues = () => {
	const { projectId, releaseId, sprintId, epicId } = useParams();
	const [project, setProject] = useState<Project>();
	const [release, setRelease] = useState<Release>();
	const [sprint, setSprint] = useState<Sprint>();
	const [epic, setEpic] = useState<Epic>();
	const [issues, setIssues] = useState<Issue[]>([]);
	const [openCreateIssue, setOpenCreateIssue] = useState(false);
	const [openEditIssue, setOpenEditIssue] = useState(false);
	const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
	const [selectedIssue, setSelectedIssue] = useState<Issue>();

	const getProject = async () => {
		try {
			if (projectId) {
				let project = await getProjectById(parseInt(projectId));
				setProject(project);
				console.log(project)
				return project;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const getRelease = async () => {
		try {
			if (releaseId) {
				let release = await getReleaseById(parseInt(releaseId));
				setRelease(release);
				console.log(release)
				return release;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const getSprint = async () => {
		try {
			if (sprintId) {
				let sprint = await getSprintById(parseInt(sprintId));
				setSprint(sprint);
				console.log(sprint)
				return sprint;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const getEpic = async () => {
		try {
			if (epicId) {
				let epic = await getEpicById(parseInt(epicId));
				setEpic(epic);
				console.log(epic)
				return epic;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}
	
	const getIssues = async () => {
		try {
			if (epicId) {
				let issues = await getIssuesByEpicId(parseInt(epicId));
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

	const handleCloseCreateIssue = (refresh?: boolean) => {
		setOpenCreateIssue(false);
		if (refresh) {
			getIssues();
		}
	}

	const handleCloseEditIssue = (refresh?: boolean) => {
		setOpenEditIssue(false);
		if (refresh) {
			getIssues();
		}
		setSelectedIssue(undefined);
	}

	const handleCloseDeleteIssue = (refresh?: boolean) => {
		setOpenDeleteIssue(false);
		if (refresh) {
			getIssues();
		}
		setSelectedIssue(undefined);
	}

	useEffect(() => {
		getProject();
		getRelease();
		getSprint();
		getEpic();
		getIssues();
    }, []);
	return(
		<Sidebar>
			<Page>
				<ProjectBreadcrumbs project={project} release={release} sprint={sprint} epic={epic} />
				{/* <CreateEpicDialog projectId={projectId} releaseId={releaseId} sprintId={sprintId} open={openCreateEpic} handleClose={handleCloseCreateEpic} />
				<EditEpicDialog open={openEditEpic} epicId={selectedEpic?.id} handleClose={handleCloseEditEpic} /> */}
				<DeleteDialog open={openDeleteIssue} id={selectedIssue?.id} handleClose={handleCloseDeleteIssue} deleteFunction={deleteIssue} name={selectedIssue?.subject} />
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
										{issue.subject}
									</td>
									<td className="text-left">{issue.priority['name']}</td>
									<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedIssue(issue); setOpenEditIssue(true) }} onDelete={()=> { setSelectedIssue(issue); setOpenDeleteIssue(true)}} /></div></td>
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