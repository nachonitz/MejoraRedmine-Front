import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getReleasesByProjectId } from '../../../api/services/projectsService';
import { useNavigate, useParams } from 'react-router-dom';
import { Release } from '../../../api/models/release';
import PageTitle from '../../../components/Shared/Page/PageTitle/PageTitle';
import Page from '../../../components/Shared/Page/Page';
import AddButton from '../../../components/Shared/Buttons/AddButton';

const ProjectReleases = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [releases, setReleases] = useState<Release[]>([]);
	
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

	useEffect(() => {  
		getReleases();
    }, []);
	return(
		<Sidebar>
			<Page>
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Releases" />
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