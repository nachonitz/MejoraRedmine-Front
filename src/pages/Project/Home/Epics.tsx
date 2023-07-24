import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getEpicsBySprintId, getProjectById } from '../../../api/services/projectsService';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import AddButton from '../../../components/Shared/Buttons/AddButton';
import { Epic } from '../../../api/models/epic';
import CreateEpicDialog from '../../../components/Pages/Epics/CreateEpicDialog/CreateEpicDialog';
import DeleteDialog from '../../../components/Shared/DeleteDialog/DeleteDialog';
import { deleteEpic } from '../../../api/services/epicsService';
import SettingsButton from '../../../components/Shared/Buttons/SettingsButton';
import EditEpicDialog from '../../../components/Pages/Epics/EditEpicDialog/EditEpicDialog';
import { Sprint } from '../../../api/models/sprint';
import { Release } from '../../../api/models/release';
import { Project } from '../../../api/models/project';
import { getReleaseById } from '../../../api/services/releasesService';
import { getSprintById } from '../../../api/services/sprintsService';
import ProjectBreadcrumbs from '../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs';

const ProjectEpics = () => {
	const { projectId, releaseId, sprintId } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState<Project>();
	const [release, setRelease] = useState<Release>();
	const [sprint, setSprint] = useState<Sprint>();
	const [epics, setEpics] = useState<Epic[]>([]);
	const [openCreateEpic, setOpenCreateEpic] = useState(false);
	const [openEditEpic, setOpenEditEpic] = useState(false);
	const [openDeleteEpic, setOpenDeleteEpic] = useState(false);
	const [selectedEpic, setSelectedEpic] = useState<Epic>();

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
	
	const getEpics = async () => {
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
		navigate(`/project/${projectId}/release/${releaseId}/sprint/${sprintId}/epic/${id}`);
	}

	const handleCloseCreateEpic = (refresh?: boolean) => {
		setOpenCreateEpic(false);
		if (refresh) {
			getEpics();
		}
	}

	const handleCloseEditEpic = (refresh?: boolean) => {
		setOpenEditEpic(false);
		if (refresh) {
			getEpics();
		}
		setSelectedEpic(undefined);
	}

	const handleCloseDeleteEpic = (refresh?: boolean) => {
		setOpenDeleteEpic(false);
		if (refresh) {
			getEpics();
		}
		setSelectedEpic(undefined);
	}

	useEffect(() => {
		console.log(sprintId)
		getProject();
		getRelease();
		getSprint();
		getEpics();
    }, []);
	return(
		<Sidebar>
			<Page>
				<ProjectBreadcrumbs project={project} release={release} sprint={sprint} />
				<CreateEpicDialog projectId={projectId} releaseId={releaseId} sprintId={sprintId} open={openCreateEpic} handleClose={handleCloseCreateEpic} />
				<EditEpicDialog open={openEditEpic} epicId={selectedEpic?.id} handleClose={handleCloseEditEpic} />
				<DeleteDialog open={openDeleteEpic} id={selectedEpic?.id} handleClose={handleCloseDeleteEpic} deleteFunction={deleteEpic} name={selectedEpic?.name} />
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Epics" />
					<AddButton onClick={ () => { setOpenCreateEpic(true) } } />
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
									<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedEpic(epic); setOpenEditEpic(true) }} onDelete={()=> { setSelectedEpic(epic); setOpenDeleteEpic(true)}} /></div></td>
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