import { filterToQueryParams } from "../../lib/utils";
import { api } from "../api";
import { ListedResponse } from "../models/common";
import {
    CreateDocumentDto,
    Document,
    DocumentFilter,
    UpdateDocumentDto,
} from "../models/document";

export const getDocuments = async (filter: DocumentFilter) => {
    const { data } = await api.get<ListedResponse<Document>>(
        `/documents?${filterToQueryParams(filter)}`
    );
    return { data };
};

export const getDocumentById = async (
    id: Document["id"]
): Promise<Document> => {
    const { data } = await api.get<Document>(`/documents/${id}`);
    return data;
};

export const createDocument = async (document: CreateDocumentDto) => {
    const { data } = await api.post("/documents", document);
    return data;
};

export const editDocument = async (
    id: Document["id"],
    document: UpdateDocumentDto
) => {
    const { data } = await api.patch(`/documents/${id}`, document);
    return data;
};

export const deleteDocument = async (id: Document["id"]): Promise<boolean> => {
    const { data } = await api.delete(`/documents/${id}`);
    return data;
};
