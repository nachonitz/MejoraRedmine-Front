import { api } from "../api";
import { Enumeration } from "../models/enumeration";


export const getDocumentCategories = async (): Promise<Enumeration[]> => {
	const response = await api.get('/enumerations', { params: { "type": "DocumentCategory" } });
	const documentCategories: Enumeration[] = response.data;
	return documentCategories;
}