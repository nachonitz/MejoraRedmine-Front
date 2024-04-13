import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { ListedResponseMetadata } from "../../../api/models/common";
import { Document, DocumentFilter } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import {
    deleteDocument,
    getDocuments,
} from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { DocumentFiltersModal } from "../../../components/Pages/Documents/DocumentFiltersModal";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import { Paginator } from "../../../components/Shared/Paginator/Paginator";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { TableHeadItem } from "../../../components/Shared/Table/TableHeadItem";
import { getFullDate, hasAccess } from "../../../lib/utils";
import { DEFAULT_PAGINATION_DATA } from "../../../utilities/constants";

const defaultFilters: DocumentFilter = {
    page: 1,
    limit: 10,
    projectId: -1,
};

const Documents = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [openDeleteDocument, setOpenDeleteDocument] = useState(false);
    const [openDocumentFiltersModal, setOpenDocumentFiltersModal] =
        useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<DocumentFilter>(defaultFilters);
    const [paginationData, setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

    const query = async (filters: DocumentFilter) => {
        try {
            if (filters.projectId !== -1) {
                setIsLoading(true);
                const { data } = await getDocuments(filters);
                setIsLoading(false);
                setDocuments(data.items);
                setPaginationData(data.meta);
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
            query(defaultFilters);
        }
        setSelectedDocument(undefined);
    };

    useEffect(() => {
        query(filters);
    }, [filters]);

    useEffect(() => {
        if (projectId && filters.projectId !== +projectId) {
            setFilters({
                ...filters,
                projectId: +projectId,
            });
        }
    }, [projectId, filters]);

    useEffect(() => {
        query(defaultFilters);
        getCategories();
        getUserPermissions();
    }, [getUserPermissions, defaultFilters]);

    return (
        <Sidebar>
            <Page>
                {openDocumentFiltersModal && projectId && (
                    <DocumentFiltersModal
                        projectId={+projectId}
                        open={openDocumentFiltersModal}
                        onClose={() => setOpenDocumentFiltersModal(false)}
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
                <DeleteDialog
                    open={openDeleteDocument}
                    id={selectedDocument?.id}
                    handleClose={handleCloseDeleteDocument}
                    deleteFunction={deleteDocument}
                    name={selectedDocument?.title}
                />
                <div className="flex justify-between items-center">
                    <PageTitle title="Documents" />
                    <div className="flex gap-x-6">
                        <SecondaryButton
                            onClick={() => setOpenDocumentFiltersModal(true)}
                        >
                            Filters
                        </SecondaryButton>
                        <Searchbar
                            onChange={setSearchText}
                            onSearch={() =>
                                query({
                                    ...filters,
                                    title: searchText,
                                })
                            }
                        />
                        {projectId &&
                            hasAccess(permissions, ["add_documents"]) && (
                                <PrimaryButton onClick={goToNewDocument}>
                                    New Document
                                </PrimaryButton>
                            )}
                    </div>
                </div>

                <div>
                    <table className="w-full mt-[30px] border-collapse">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th className="w-[30px]"></th>
                                <TableHeadItem
                                    attribute="title"
                                    setFilters={setFilters}
                                >
                                    Name
                                </TableHeadItem>
                                <th className="text-left">Category</th>
                                <TableHeadItem
                                    attribute="createdAt"
                                    setFilters={setFilters}
                                >
                                    Created
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="tags"
                                    setFilters={setFilters}
                                >
                                    Tags
                                </TableHeadItem>
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
                    <Paginator
                        show={
                            paginationData.totalPages > 1 &&
                            documents.length > 0
                        }
                        page={filters.page ?? 1}
                        totalPages={paginationData.totalPages}
                        onPageChange={(page: number) =>
                            setFilters({ ...filters, page })
                        }
                    />
                    {documents.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="text-gray-500">
                                        There are no documents yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default Documents;
