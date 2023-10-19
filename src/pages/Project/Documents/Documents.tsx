import { useEffect, useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdAdd, MdUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Document } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import {
    deleteDocument,
    getDocuments,
} from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import UploadDocumentDialog from "../../../components/Pages/Documents/UploadDocumentDialog/UploadDocumentDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate } from "../../../lib/utils";

const Documents = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [openCreateDocument, setOpenCreateDocument] = useState(false);
    const [openDeleteDocument, setOpenDeleteDocument] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<Document>();

    console.log({ documents });

    const getAllDocuments = async () => {
        try {
            if (projectId) {
                const { data } = await getDocuments({
                    projectId: +projectId,
                });
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

    const goToNewDocument = () => {
        navigate(`/project/${projectId}/documents/new`);
    };

    const handleCloseCreateDocument = (refresh?: boolean) => {
        setOpenCreateDocument(false);
        if (refresh) {
            getAllDocuments();
        }
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
    }, []);

    return (
        <Sidebar>
            <Page>
                <UploadDocumentDialog
                    projectId={projectId}
                    categories={documentCategories}
                    open={openCreateDocument}
                    handleClose={handleCloseCreateDocument}
                />
                {/* <EditRiskDialog
                    open={openEditRisk}
                    riskId={selectedDocument?.id}
                    handleClose={handleCloseEditRisk}
                /> */}
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
                        <PrimaryButton onClick={goToNewDocument}>
                            <div className="flex w-full items-center gap-2">
                                <MdAdd className="text-[24px]" />
                                <span>New Document</span>
                            </div>
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => setOpenCreateDocument(true)}
                        >
                            <div className="flex w-full items-center gap-2">
                                <MdUpload className="text-[24px]" />
                                <span>Upload File</span>
                            </div>
                        </PrimaryButton>
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
                                                    setOpenDeleteDocument(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {documents.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            <span className="text-center">
                                There are no documents yet
                            </span>
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default Documents;
