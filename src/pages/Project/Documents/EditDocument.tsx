/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    Select,
    TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateDocumentDto } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { File as RedmineFile } from "../../../api/models/file";
import {
    editDocument,
    getDocumentById,
} from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { getFiles, uploadFile } from "../../../api/services/filesService";
import { FilePicker } from "../../../components/Shared/Dropzone/FilePicker";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import {
    errorToast,
    infoToast,
    successToast,
} from "../../../components/Shared/Toast";
import { UserContext } from "../../../context/UserContext";

const EditDocument = () => {
    const { projectId, documentId } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [documentCategoryId, setDocumentCategoryId] = useState<
        number | string
    >("");
    const [tagsString, setTagsString] = useState<string | undefined>();
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorDocumentCategory, setErrorDocumentCategory] = useState(false);
    const [errorTags, setErrorTags] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [existingFiles, setExistingFiles] = useState<RedmineFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const clearErrors = () => {
        setErrorTitle(false);
        setErrorDocumentCategory(false);
        setServerErrors([]);
    };

    const checkForFieldsErrors = () => {
        let errorFound = false;
        if (!title) {
            setErrorTitle(true);
            errorFound = true;
        }
        if (!documentCategoryId) {
            setErrorDocumentCategory(true);
            errorFound = true;
        }
        if (tagsString) {
            const tags = tagsString.split(",");
            if (tags.length > 5) {
                setErrorTags(true);
                errorFound = true;
            }
        }
        return errorFound;
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

    const handleEdit = async () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound || !projectId) return;

        setIsLoading(true);
        const document: UpdateDocumentDto = {
            title: title,
            description: description,
            categoryId: +documentCategoryId,
            projectId: +projectId,
            authorId: user?.id,
            tags: tagsString?.split(",").map((tag) => tag.trim()),
        };
        try {
            const res = await editDocument(+documentId!, document);
            successToast("Document updated successfully");
            if (selectedFiles && selectedFiles.length > 0) {
                infoToast("Uploading new attachments...");
                for (const file of selectedFiles) {
                    await uploadFile(file, {
                        ...document,
                        projectId: document.projectId!,
                        title: document.title!,
                        text: document.description,
                        documentId: res.id,
                    });
                }
                successToast("New attachments uploaded successfully");
            }
            navigate(`/project/${projectId}/documents`);
        } catch (error: any) {
            console.log(error);
            setServerErrors(error.messages);
            errorToast("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            if (documentId && projectId) {
                const document = await getDocumentById(+documentId);
                const { data } = await getFiles({
                    documentId: +documentId,
                    projectId: +projectId,
                });
                setTitle(document.title);
                setDescription(document.description ?? "");
                setDocumentCategoryId(document.categoryId);
                setTagsString(document.tags?.join(","));
                setExistingFiles(data.items);
            }
        };
        fetch();
    }, [documentId, projectId]);

    return (
        <Sidebar>
            <Page>
                <PageTitle
                    title="Edit document"
                    goBackTo={`/project/${projectId}/documents`}
                />
                <div className="mt-[24px] flex flex-col gap-[20px]">
                    <TextField
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        error={errorTitle}
                        className="w-full"
                        id="title"
                        label="Title"
                        variant="outlined"
                    />
                    <TextField
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="w-full"
                        id="description"
                        label="Text"
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                    <div className="flex gap-x-4">
                        <FormControl className="w-1/2">
                            <InputLabel
                                id="category"
                                error={errorDocumentCategory}
                            >
                                Document Category
                            </InputLabel>
                            <Select
                                labelId="category-label"
                                value={documentCategoryId}
                                label="Document Category"
                                error={errorDocumentCategory}
                                onChange={(e) =>
                                    setDocumentCategoryId(e.target.value)
                                }
                            >
                                {documentCategories &&
                                    documentCategories.length > 0 &&
                                    documentCategories.map(
                                        (category, index) => (
                                            <MenuItem
                                                key={index}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </MenuItem>
                                        )
                                    )}
                            </Select>
                        </FormControl>
                        <TextField
                            onChange={(e) => setTagsString(e.target.value)}
                            error={errorTags}
                            value={tagsString}
                            className="w-1/2"
                            label="Tags"
                            placeholder="Separate tags with commas... (Max 5)"
                            variant="outlined"
                        />
                    </div>
                    {existingFiles && existingFiles.length > 0 && (
                        <div className="flex flex-col">
                            <label className="text-gray-600">
                                Existing attachments
                            </label>
                            <div className="flex gap-x-6">
                                {existingFiles.map((file) => (
                                    <div
                                        key={file.title}
                                        className="flex justify-between items-center"
                                    >
                                        <div className="flex flex-col">
                                            <span>
                                                {file.title.length > 40
                                                    ? file.title.substring(
                                                          0,
                                                          39
                                                      ) + "..."
                                                    : file.title}
                                            </span>
                                            <span className="text-[#888] text-[14px]">
                                                {(
                                                    (file.filesize ?? 0) / 1024
                                                ).toFixed(2)}{" "}
                                                kb
                                            </span>
                                        </div>
                                        <div className="ml-2">
                                            <IconButton
                                                onClick={() => {
                                                    const newselectedFiles =
                                                        existingFiles.filter(
                                                            (m) =>
                                                                m.title !==
                                                                file.title
                                                        );
                                                    setExistingFiles(
                                                        newselectedFiles
                                                    );
                                                }}
                                                component="label"
                                            >
                                                <RiDeleteBin6Line />
                                            </IconButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <FilePicker
                        selectedFiles={selectedFiles}
                        onFilesSelected={(files) => setSelectedFiles(files)}
                        label="New attachments"
                        helperText="Drag and drop files here or click to browse."
                    />
                    <div className="mb-24 mt-8 w-full">
                        <Button
                            onClick={handleEdit}
                            className="w-full h-12"
                            variant="contained"
                            component="label"
                        >
                            {isLoading ? (
                                <CircularProgress
                                    sx={{ color: "white", padding: 0 }}
                                    size={20}
                                />
                            ) : (
                                "Edit"
                            )}
                        </Button>
                    </div>
                    {serverErrors && serverErrors.length > 0 && (
                        <div className="mt-2 min-h-[10px] text-left">
                            {serverErrors.map((error, index) => (
                                <div key={index}>
                                    <p className="text-red-700"> {error}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default EditDocument;
