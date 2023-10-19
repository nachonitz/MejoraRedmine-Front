import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import { CreateFileDto, File, FileFilter } from "../models/file";

export const getFiles = async (filter: FileFilter) => {
    const { data } = await api.get<ListedResponse<Document>>(
        `/files?${filterToQueryParams(filter)}`
    );
    return { data };
};

//TODO: revisar, falta algun tipo?
export const uploadFile = async (input: any): Promise<File> => {
    const formData = new FormData();
    formData.append("file", input.file);

    const uploadedFile = await api.post("/files/upload", formData);
    const createDocumentInput: CreateFileDto = {
        title: input.title,
        token: uploadedFile.data.upload.token,
        projectId: input.projectId,
        authorId: input.authorId,
        tags: input.tags,
    };

    await createFile(createDocumentInput);
    return uploadedFile.data;
};

export const createFile = async (file: CreateFileDto): Promise<File> => {
    const { data } = await api.post("/files", file);
    return data;
};
