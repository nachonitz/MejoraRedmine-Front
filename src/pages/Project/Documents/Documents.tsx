import { useEffect, useState } from "react";
import { IoMdAttach } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdAdd, MdUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { Document } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { Risk } from "../../../api/models/risk";
import { getDocumentsByProjectId } from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { deleteRisk } from "../../../api/services/risksService";
import UploadDocumentDialog from "../../../components/Pages/Documents/UploadDocumentDialog/UploadDocumentDialog";
import EditRiskDialog from "../../../components/Pages/Risks/EditRiskDialog/EditRiskDialog";
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
    const [openEditRisk, setOpenEditRisk] = useState(false);
    const [openDeleteRisk, setOpenDeleteRisk] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<Risk>();

    const getDocuments = async () => {
        try {
            if (projectId) {
                const documents = await getDocumentsByProjectId(
                    parseInt(projectId)
                );
                setDocuments(documents);
                console.log(documents);
                return documents;
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
                setDocumentCategories(data.items);
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
            getDocuments();
        }
    };

    const handleCloseEditRisk = (refresh?: boolean) => {
        setOpenEditRisk(false);
        if (refresh) {
            getDocuments();
        }
        setSelectedRisk(undefined);
    };

    const handleCloseDeleteRisk = (refresh?: boolean) => {
        setOpenDeleteRisk(false);
        if (refresh) {
            getDocuments();
        }
        setSelectedRisk(undefined);
    };

    useEffect(() => {
        getDocuments();
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
                <EditRiskDialog
                    open={openEditRisk}
                    riskId={selectedRisk?.id}
                    handleClose={handleCloseEditRisk}
                />
                <DeleteDialog
                    open={openDeleteRisk}
                    id={selectedRisk?.id}
                    handleClose={handleCloseDeleteRisk}
                    deleteFunction={deleteRisk}
                    name={selectedRisk?.name}
                />
                <div className="flex gap-[15px] items-center">
                    <PageTitle title="Documents" />
                    {/* <AddButton onClick={ () => { setOpenCreateDocument(true) } } /> */}
                </div>
                <div className="mt-10 flex gap-4">
                    <PrimaryButton
                        onClick={() => {
                            goToNewDocument();
                        }}
                    >
                        <div className="flex w-full items-center gap-2">
                            <MdAdd className="text-[24px]" />
                            <span>New Document</span>
                        </div>
                    </PrimaryButton>
                    <PrimaryButton
                        onClick={() => {
                            setOpenCreateDocument(true);
                        }}
                    >
                        <div className="flex w-full items-center gap-2">
                            <MdUpload className="text-[24px]" />
                            <span>Upload File</span>
                        </div>
                    </PrimaryButton>
                </div>
                <div>
                    <table className="w-full mt-[30px] border-collapse">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <th className="w-[30px]"></th>
                                <th className="text-left">Title</th>
                                <th className="text-left">Size</th>
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
                                        {document.type === "BINARY" ? (
                                            <IoMdAttach className="w-[24px] h-[24px] text-primary" />
                                        ) : (
                                            <IoDocumentTextOutline className="w-[24px] h-[24px] text-primary" />
                                        )}
                                        {/* <img className="w-[24px] h-[24px]" src={'/src/assets/icons/user-story-icon.png'} /> */}
                                    </td>
                                    <td className="gap-[10px] text-left">
                                        {document.filename}
                                    </td>
                                    <td className="text-left">
                                        {(document.filesize / 1024).toFixed(2)}{" "}
                                        kb
                                    </td>
                                    <td className="text-left">
                                        {document.author.firstname}{" "}
                                        {document.author.lastname} (
                                        {getFullDate(document.created_on)})
                                    </td>
                                    <td className="text-left">
                                        {document.tags}
                                    </td>
                                    <td className="text-right">
                                        <div className="flex justify-end">
                                            <SettingsButton
                                                onEdit={() => {
                                                    setSelectedRisk(document);
                                                    setOpenEditRisk(true);
                                                }}
                                                onDelete={() => {
                                                    setSelectedRisk(risk);
                                                    setOpenDeleteRisk(true);
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
