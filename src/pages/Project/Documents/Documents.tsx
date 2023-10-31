import { useCallback, useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Document } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import {
    deleteDocument,
    getDocuments,
} from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate, hasAccess } from "../../../lib/utils";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { LinearProgress } from "@mui/material";

const Documents = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [openDeleteDocument, setOpenDeleteDocument] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getAllDocuments = async () => {
        try {
            if (projectId) {
                setIsLoading(true);
                const { data } = await getDocuments({
                    projectId: +projectId,
                });
                setIsLoading(false);
                setDocuments(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const getCategories = async () => {
        try {
            if (projectId) {
                const { data } = await getEnumerations({
                    type: EnumerationType.DOCUMENT_CATEGORY,
                });
                setDocumentCategories(data);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

    const getUserPermissions = useCallback(async () => {
        try {
            if (projectId) {
                const allPermissions = await getMyPermissions();
                const projectPermissions = allPermissions.find(
                    (permission) => permission.projectId === +projectId
                );
                setPermissions(projectPermissions?.roles ?? []);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const goToNewDocument = () => {
        navigate(`/project/${projectId}/documents/new`);
    };

    const handleCloseDeleteDocument = (refresh?: boolean) => {
        setOpenDeleteDocument(false);
        if (refresh) {
            getAllDocuments();
        }
        setSelectedDocument(undefined);
    };

    useEffect(() => {
        getAllDocuments();
        getCategories();
        getUserPermissions();
    }, [getUserPermissions]);

    return (
        <Sidebar>
            <Page>
                <DeleteDialog
                    open={openDeleteDocument}
                    id={selectedDocument?.id}
                    handleClose={handleCloseDeleteDocument}
                    deleteFunction={deleteDocument}
                    name={selectedDocument?.title}
                />
                <div className="flex justify-between items-center">
                    <PageTitle title="Documents" />
                    <div className="flex gap-4">
                        {projectId &&
                            hasAccess(permissions, ["add_documents"]) && (
                                <PrimaryButton onClick={goToNewDocument}>
                                    <div className="flex w-full items-center gap-2">
                                        <MdAdd className="text-[24px]" />
                                        <span>New Document</span>
                                    </div>
                                </PrimaryButton>
                            )}
                    </div>
                </div>

                <div>
                    <table className="w-full mt-[30px] border-collapse">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th className="w-[30px]"></th>
                                <th className="text-left">Title</th>
                                <th className="text-left">Category</th>
                                <th className="text-left">Created</th>
                                <th className="text-left">Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((document: Document) => (
                                <tr
                                    key={document.id}
                                    onClick={() => {
                                        console.log(document.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="w-[30px]">
                                        <IoDocumentTextOutline className="w-[24px] h-[24px] text-primary" />
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {document.title.length > 40
                                            ? document.title.substring(0, 39) +
                                              "..."
                                            : document.title}
                                    </td>
                                    <td className="text-left">
                                        {
                                            documentCategories.find(
                                                (category) =>
                                                    category.id ===
                                                    document.categoryId
                                            )?.name
                                        }
                                    </td>
                                    <td className="text-left">
                                        {document.author &&
                                            `${document.author.firstname} ${document.author.lastname} - `}
                                        ({getFullDate(document.createdAt)})
                                    </td>
                                    <td className="text-left">
                                        {document.tags &&
                                        document.tags.length > 0
                                            ? document.tags.length > 3
                                                ? document.tags
                                                      .slice(0, 3)
                                                      .join(", ") + "..."
                                                : document.tags.join(", ")
                                            : "-"}
                                    </td>
                                    <td className="text-right">
                                        {hasAccess(permissions, [
                                            "edit_documents",
                                            "delete_documents",
                                        ]) && (
                                            <div className="flex justify-end">
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedDocument(
                                                            document
                                                        );
                                                        navigate(
                                                            `/project/${projectId}/document/${document.id}/edit`
                                                        );
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedDocument(
                                                            document
                                                        );
                                                        setOpenDeleteDocument(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {documents.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <span className="text-center">
                                    There are no documents yet.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default Documents;
