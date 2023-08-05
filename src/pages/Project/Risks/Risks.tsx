import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Shared/Sidebar/Sidebar';
import { getProjectById, getReleasesByProjectId } from '../../../api/services/projectsService';
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
import { Project } from '../../../api/models/project';
import { Risk } from '../../../api/models/risk';
import { deleteRisk, getRisksByProjectId } from '../../../api/services/risksService';
import CreateRiskDialog from '../../../components/Pages/Risks/CreateRiskDialog/CreateRiskDialog';
import EditRiskDialog from '../../../components/Pages/Risks/EditRiskDialog/EditRiskDialog';

const Risks = () => {
	const { projectId } = useParams();
	const navigate = useNavigate();
	const [project, setProject] = useState<Project>();
	const [risks, setRisks] = useState<Risk[]>([]);
	const [openCreateRisk, setOpenCreateRisk] = useState(false);
	const [openEditRisk, setOpenEditRisk] = useState(false);
	const [openDeleteRisk, setOpenDeleteRisk] = useState(false);
	const [selectedRisk, setSelectedRisk] = useState<Risk>();

	const getColor = (status: string) => {
		switch (status) {
			case 'High':
				return '#E80000';
			case 'Medium':
				return '#FFAA04';
			case 'Low':
				return '#43B000';
			case 'Very Low':
				return '#338800';
			case 'Very High':
				return '#c30000';
			default:
				return '#000000';
		}
	}

	const getRisks = async () => {
		try {
			if (projectId) {
				let risks = await getRisksByProjectId(parseInt(projectId));
				setRisks(risks);
				console.log(risks)
				return project;
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

	const handleCloseCreateRisk = (refresh?: boolean) => {
		setOpenCreateRisk(false);
		if (refresh) {
			getRisks();
		}
	}

	const handleCloseEditRisk = (refresh?: boolean) => {
		setOpenEditRisk(false);
		if (refresh) {
			getRisks();
		}
		setSelectedRisk(undefined);
	}

	const handleCloseDeleteRisk = (refresh?: boolean) => {
		setOpenDeleteRisk(false);
		if (refresh) {
			getRisks();
		}
		setSelectedRisk(undefined);
	}

	useEffect(() => {  
		getRisks();
    }, []);
	return(
		<Sidebar>
			<Page>
				<CreateRiskDialog projectId={projectId} open={openCreateRisk} handleClose={handleCloseCreateRisk} />
				<EditRiskDialog open={openEditRisk} riskId={selectedRisk?.id} handleClose={handleCloseEditRisk} />
				<DeleteDialog open={openDeleteRisk} id={selectedRisk?.id} handleClose={handleCloseDeleteRisk} deleteFunction={deleteRisk} name={selectedRisk?.name} />
				<div className="flex gap-[15px] items-center">
					<PageTitle title="Risks" />
					<AddButton onClick={ () => { setOpenCreateRisk(true) } } />
				</div>
				<div>
					<table className="w-full mt-[30px] border-collapse">
						<thead>
							<tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
								<th className="text-center">Risk</th>
								<th className="text-center">Probability</th>
								<th className="text-center">Impact</th>
								<th className="text-center">Level</th>
								<th className="text-center">Status</th>
								<th className="text-center">Last updated</th>
							</tr>
						</thead>
						<tbody>
							{risks.map((risk: Risk) => (
								<tr key={risk.id} onClick={()=> {console.log(risk.id)}} className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50">
									<td className="gap-[10px] text-left">
										{risk.name}
									</td>
									<td style={{color: getColor(risk.probability)}} className="text-center">{risk.probability}</td>
									<td style={{color: getColor(risk.impact)}} className="text-center">{risk.impact}</td>
									<td className="text-center">
										<div className="w-full flex justify-center">
											<div style={{backgroundColor: getColor(risk.level)}} className="rounded-[18px] p-1 bg-red-500 text-white w-[120px]">
												{risk.level}
											</div>
										</div>
									</td>
									<td className="text-center">{risk.status}</td>
									<td className="text-center">{getFullDate(risk.updatedAt)}</td>
									<td className="text-right"><div className="flex justify-end"><SettingsButton onEdit={()=> { setSelectedRisk(risk); setOpenEditRisk(true) }} onDelete={()=> { setSelectedRisk(risk); setOpenDeleteRisk(true)}} /></div></td>
								</tr>
							))}
						</tbody>
					</table>
					{risks.length === 0 && (
						<div className="text-[18px] h-[40px] w-full text-center mt-2">
							<span className="text-center">
								There are no risks yet
							</span>
						</div>
					)}
				</div>
			</Page>
		</Sidebar>
	)
};

export default Risks;