import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getProjectById, getSprintsByReleaseId } from '../../../api/services/projectsService';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import AddButton from '../../../components/Shared/Buttons/AddButton';
import { Sprint } from '../../../api/models/sprint';
import CreateSprintDialog from '../../../components/Pages/Sprints/CreateSprintDialog/CreateSprintDialog';
import SettingsButton from '../../../components/Shared/Buttons/SettingsButton';
import DeleteDialog from '../../../components/Shared/DeleteDialog/DeleteDialog';
import { deleteSprint } from '../../../api/services/sprintsService';
import EditSprintDialog from '../../../components/Pages/Sprints/EditSprintDialog/EditSprintDialog';
import { Project } from '../../../api/models/project';
import { getReleaseById } from '../../../api/services/releasesService';
import { Release } from '../../../api/models/release';
import ProjectBreadcrumbs from '../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs';

const ProjectSprints = () => {
	const { projectId, releaseId } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState<Project>();
	const [release, setRelease] = useState<Release>();
	const [sprints, setSprints] = useState<Sprint[]>([]);
	const [openCreateSprint, setOpenCreateSprint] = useState(false);
	const [openEditSprint, setOpenEditSprint] = useState(false);
	const [openDeleteSprint, setOpenDeleteSprint] = useState(false);
	const [selectedSprint, setSelectedSprint] = useState<Sprint>();

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
		navigate(`/project/${projectId}/release/${releaseId}/sprint/${id}`);
		console.log(id);
	}

	const getFullDate = (date: Date) => {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		return `${month}/${day}/${year}`;
	}

	const handleCloseCreateSprint = (refresh?: boolean) => {
		setOpenCreateSprint(false);
		if (refresh) {
			getSprints();
		}
	}

	const handleCloseEditSprint = (refresh?: boolean) => {
		setOpenEditSprint(false);
		if (refresh) {
			getSprints();
		}
		setSelectedSprint(undefined);
	}

	const handleCloseDeleteSprint = (refresh?: boolean) => {
		setOpenDeleteSprint(false);
		if (refresh) {
			getSprints();
		}
		setSelectedSprint(undefined);
	}

	useEffect(() => {  
		getSprints();
		getRelease();
    }, []);
	return(
		<Sidebar>
			<Page>
				<ProjectBreadcrumbs project={release?.project} release={release} />
				<CreateSprintDialog projectId={projectId} releaseId={releaseId} open={openCreateSprint} handleClose={handleCloseCreateSprint} />
				<EditSprintDialog open={openEditSprint} sprintId={selectedSprint?.id} handleClose={handleCloseEditSprint} />
				<DeleteDialog open={openDeleteSprint} id={selectedSprint?.id} handleClose={handleCloseDeleteSprint} deleteFunction={deleteSprint} name={selectedSprint?.name} />
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Sprints" />
					<AddButton onClick={ () => { setOpenCreateSprint(true) } } />
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
									<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedSprint(sprint); setOpenEditSprint(true) }} onDelete={()=> { setSelectedSprint(sprint); setOpenDeleteSprint(true)}} /></div></td>
								</tr>
							))}
						</tbody>
					</table>
					{sprints.length === 0 && (
						<div className="text-[18px] h-[40px] w-full text-center mt-2">
							<span className="text-center">
								There are no sprints yet
							</span>
						</div>
					)}
				</div>
			</Page>
		</Sidebar>
	)
};

export default ProjectSprints;