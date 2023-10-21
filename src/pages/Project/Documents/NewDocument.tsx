import {
    Button,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateDocumentDto } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { createDocument } from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import { uploadFile } from "../../../api/services/filesService";
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
import { useNavigate } from "react-router-dom";

const NewDocument = () => {
    const { projectId } = useParams();
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

    const handleCreate = async () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound || !projectId) return;

        const document: CreateDocumentDto = {
            title: title,
            description: description,
            categoryId: +documentCategoryId,
            projectId: +projectId,
            authorId: user?.id,
            tags: tagsString?.split(",").map((tag) => tag.trim()),
        };
        try {
            const res = await createDocument(document);
            successToast("Document created successfully");
            if (selectedFiles && selectedFiles.length > 0) {
                infoToast("Uploading attachments...");
                for (const file of selectedFiles) {
                    await uploadFile(file, {
                        ...document,
                        text: document.description,
                        documentId: res.id,
                    });
                }
                successToast("Attachments uploaded successfully");
            }
            navigate(`/project/${projectId}/documents`);
        } catch (error: any) {
            console.log(error);
            setServerErrors(error.messages);
            errorToast("Something went wrong");
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Sidebar>
            <Page>
                <PageTitle
                    title="New document"
                    goBackTo={`/project/${projectId}/documents`}
                />
                <div className="mt-[24px] flex flex-col gap-[20px]">
                    <TextField
                        onChange={(e) => setTitle(e.target.value)}
                        error={errorTitle}
                        className="w-full"
                        id="title"
                        label="Title"
                        variant="outlined"
                    />
                    <TextField
                        onChange={(e) => setDescription(e.target.value)}
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
                            className="w-1/2"
                            id="tags"
                            label="Tags"
                            placeholder="Separate tags with commas... (Max 5)"
                            variant="outlined"
                        />
                    </div>
                    <FilePicker
                        selectedFiles={selectedFiles}
                        onFilesSelected={(files) => setSelectedFiles(files)}
                        label="Attachments"
                        helperText="Drag and drop files here or click to browse."
                    />
                    <div className="mb-24 mt-8 w-full">
                        <Button
                            onClick={handleCreate}
                            className="w-full h-12"
                            variant="contained"
                            component="label"
                        >
                            Create document
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

export default NewDocument;
