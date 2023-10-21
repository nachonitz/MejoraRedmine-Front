import { useParams } from "react-router-dom";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import { useEffect, useState } from "react";
import { Document } from "../../../api/models/document";
import { getDocumentById } from "../../../api/services/documentsService";
import { getFullDate } from "../../../lib/utils";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { getFiles } from "../../../api/services/filesService";
import { File } from "../../../api/models/file";

const SingleDocument = () => {
    const { projectId, documentId } = useParams();
    const [document, setDocument] = useState<Document>();
    const [documentCategories, setDocumentCategories] =
        useState<Enumeration[]>();
    const [files, setFiles] = useState<File[]>();

    useEffect(() => {
        const fetch = async () => {
            if (documentId && projectId) {
                const document = await getDocumentById(+documentId);
                const { data: categories } = await getEnumerations({
                    type: EnumerationType.DOCUMENT_CATEGORY,
                });
                const { data: files } = await getFiles({
                    documentId: +documentId,
                    projectId: +projectId,
                });

                setDocument(document);
                setDocumentCategories(categories);
                setFiles(files.items);
            }
        };
        fetch();
    }, [documentId, projectId]);

    return (
        <Sidebar>
            <Page>
                <PageTitle
                    title={document?.title || "Document"}
                    goBackTo={`/project/${projectId}/documents`}
                />
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center">
                        <p className="text-gray-500">
                            {document?.createdAt
                                ? `${getFullDate(document?.createdAt)} - `
                                : ""}
                            {
                                documentCategories?.find(
                                    (category) =>
                                        category.id === document?.categoryId
                                )?.name
                            }
                        </p>
                    </div>
                    <p className="text-gray-500">
                        Tags: {document?.tags?.join(", ")}
                    </p>
                </div>
                <div className="flex flex-col mt-8 min-h-[400px]">
                    {document?.description}
                </div>
                {files && files.length > 0 && (
                    <div className="flex flex-col">
                        <label className="text-gray-600 mb-2">
                            Attachments
                        </label>
                        <div className="flex gap-x-8">
                            {files.map((file) => (
                                <div
                                    key={file.title}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <span>
                                            {file.title.length > 40
                                                ? file.title.substring(0, 39) +
                                                  "..."
                                                : file.title}
                                        </span>
                                        <span className="text-[#888] text-[14px]">
                                            {(
                                                (file.filesize ?? 0) / 1024
                                            ).toFixed(2)}{" "}
                                            kb
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Page>
        </Sidebar>
    );
};

export default SingleDocument;
