import { api } from "../api";
import { Document } from "../models/document";


export const getDocumentsByProjectId = async (projectId: number): Promise<Document[]> => {
	const response = await api.get('/files', { params: { projectId } });
	const documents: Document[] = response.data;
	return documents;
}

function readFileDataAsBase64(file: any) {

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            resolve(event.target.result);
        };

        reader.onerror = (err) => {
            reject(err);
        };

        reader.readAsBinaryString(file);
    });
}


export const uploadFile = async (input: any): Promise<Document> => {
	console.log(input)

	const formData = new FormData();
	formData.append('file', input.file);

	const uploadedFile = await api.post('/files/upload', formData);
	console.log(uploadedFile.data.upload.token);
	const createDocumentInput = {
		title: input.title,
		token: uploadedFile.data.upload.token,
		projectId: input.projectId,
		type: "BINARY",
		authorId: input.authorId,
		documentCategoryId: input.documentCategoryId,
		tags: input.tags,
	}

	await createFile(createDocumentInput);

	// const response = await api.post('/files', file);
	// const newFile: Document = response.data;
	return uploadedFile.data;
}

export const createFile = async (file: any): Promise<Document> => {
	const response = await api.post('/files', file);
	const newFile: Document = response.data;
	return newFile;
}

// export const createRisk = async (risk: any): Promise<Risk> => {
// 	const response = await api.post('/risks', risk);
// 	const newRisk: Risk = response.data;
// 	return newRisk;
// }

// export const getRiskById = async (riskId: number): Promise<Risk> => {
// 	const response = await api.get(`/risks/${riskId}`);
// 	const risk: Risk = response.data;
// 	return risk;
// }

// export const editRisk = async (risk: any): Promise<Risk> => {
// 	const response = await api.patch(`/risks/${risk.id}`, risk);
// 	const editedRisk: Risk = response.data.risk;
// 	return editedRisk;
// }

// export const deleteRisk = async (riskId: number): Promise<boolean> => {
// 	const response = await api.delete(`/risks/${riskId}`);
// 	return true;
// }