import { api } from "../api";
import { Epic } from "../models/epic";
import { Risk } from "../models/risk";


export const getRisksByProjectId = async (projectId: number): Promise<Risk[]> => {
	const response = await api.get('/risks', { params: { projectId } });
	const risks: Risk[] = response.data.items;
	return risks;
}

export const createRisk = async (risk: any): Promise<Risk> => {
	const response = await api.post('/risks', risk);
	const newRisk: Risk = response.data;
	return newRisk;
}

export const getRiskById = async (riskId: number): Promise<Risk> => {
	const response = await api.get(`/risks/${riskId}`);
	const risk: Risk = response.data;
	return risk;
}

export const editRisk = async (risk: any): Promise<Risk> => {
	const response = await api.patch(`/risks/${risk.id}`, risk);
	const editedRisk: Risk = response.data.risk;
	return editedRisk;
}

export const deleteRisk = async (riskId: number): Promise<boolean> => {
	const response = await api.delete(`/risks/${riskId}`);
	return true;
}