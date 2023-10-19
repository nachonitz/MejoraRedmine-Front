import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import { CreateFileDto, File as RedmineFile, FileFilter } from "../models/file";

export const getFiles = async (filter: FileFilter) => {
    const { data } = await api.get<ListedResponse<Document>>(
        `/files?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const uploadFile = async (
    file: File,
    dto: CreateFileDto
): Promise<RedmineFile> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data: uploadData } = await api.post("/files/upload", formData);
    return await createFile({
        ...dto,
        token: uploadData.upload.token,
    });
};

export const createFile = async (file: CreateFileDto): Promise<RedmineFile> => {
    const { data } = await api.post("/files", file);
    return data;
};
