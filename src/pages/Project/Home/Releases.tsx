import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getReleasesByProjectId } from '../../../api/services/projectsService';
import { useNavigate, useParams } from 'react-router-dom';
import { Release } from '../../../api/models/release';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import AddButton from '../../../components/Shared/Buttons/AddButton';
import CreateReleaseDialog from '../../../components/Pages/Releases/CreateReleaseDialog/CreateReleaseDialog';
import SettingsButton from '../../../components/Shared/Buttons/SettingsButton';
import DeleteDialog from '../../../components/Shared/DeleteDialog/DeleteDialog';
import { deleteRelease } from '../../../api/services/releasesService';
import EditReleaseDialog from '../../../components/Pages/Releases/EditReleaseDialog/EditReleaseDialog';

const ProjectReleases = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [releases, setReleases] = useState<Release[]>([]);
	const [openCreateRelease, setOpenCreateRelease] = useState(false);
	const [openEditRelease, setOpenEditRelease] = useState(false);
	const [openDeleteRelease, setOpenDeleteRelease] = useState(false);
	const [selectedRelease, setSelectedRelease] = useState<Release>();
	
	const getReleases = async () => {
		try {
			if (projectId) {
				let releases = await getReleasesByProjectId(parseInt(projectId));
				setReleases(releases);
				console.log(releases)
				return releases;
			}
		} catch (error) {
			throw new Error('Error. Please try again.');
		}
	}

	const goToRelease = (releaseId: number) => {
		navigate(`/project/${projectId}/release/${releaseId}`);
		console.log(projectId);
	}

	const getFullDate = (date: Date) => {
		const day = new Date(date).getDate();
		const month = new Date(date).getMonth() + 1;
		const year = new Date(date).getFullYear();
		return `${month}/${day}/${year}`;
	}

	const handleCloseCreateRelease = (refresh?: boolean) => {
		setOpenCreateRelease(false);
		if (refresh) {
			getReleases();
		}
	}

	const handleCloseEditRelease = (refresh?: boolean) => {
		setOpenEditRelease(false);
		if (refresh) {
			getReleases();
		}
		setSelectedRelease(undefined);
	}

	const handleCloseDeleteRelease = (refresh?: boolean) => {
		setOpenDeleteRelease(false);
		if (refresh) {
			getReleases();
		}
		setSelectedRelease(undefined);
	}

	useEffect(() => {  
		getReleases();
    }, []);
	return(
		<Sidebar>
			<Page>
				<CreateReleaseDialog projectId={projectId} open={openCreateRelease} handleClose={handleCloseCreateRelease} />
				<EditReleaseDialog open={openEditRelease} releaseId={selectedRelease?.id} handleClose={handleCloseEditRelease} />
				<DeleteDialog open={openDeleteRelease} id={selectedRelease?.id} handleClose={handleCloseDeleteRelease} deleteFunction={deleteRelease} name={selectedRelease?.name} />
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Releases" />
					<AddButton onClick={ () => { setOpenCreateRelease(true) } } />
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
							{releases.map((release: Release) => (
								<tr key={release.id} onClick={()=> {goToRelease(release.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
									<td className='w-[30px]'>
										<img className="w-[24px] h-[24px]" src={'/src/assets/icons/release-icon.png'} />
									</td>
									<td className="gap-[10px] text-left">
										{release.name}
									</td>
									<td className="text-left">{getFullDate(release.startDate)}</td>
									<td className="text-left">{getFullDate(release.endDate)}</td>
									<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedRelease(release); setOpenEditRelease(true) }} onDelete={()=> { setSelectedRelease(release); setOpenDeleteRelease(true)}} /></div></td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Page>
		</Sidebar>
	)
};

export default ProjectReleases;