import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    Select,
    TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useParams } from "react-router-dom";
import RichTextEditor from "react-rte";
import { Document } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { uploadFile } from "../../../api/services/documentsService";
import { getEnumerations } from "../../../api/services/enumerationsService";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { UserContext } from "../../../context/UserContext";

const NewDocument = () => {
    const { projectId } = useParams();
    const { user } = useContext(UserContext);
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [documentCategoryId, setDocumentCategoryId] = useState<
        number | string
    >("");
    const [file, setFile] = useState<File | undefined>(undefined);
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorDocumentCategory, setErrorDocumentCategory] = useState(false);
    const [errorFile, setErrorFile] = useState(false);
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    function handleChangeFile(event: any) {
        setFile(event.target.files[0]);
        console.log(event.target.result);
        console.log(event.target.files[0]);
    }

    const clearErrors = () => {
        setErrorTitle(false);
        setErrorDocumentCategory(false);
        setErrorFile(false);
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
        if (!file) {
            setErrorFile(true);
            errorFound = true;
        }
        return errorFound;
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

    const handleCreate = () => {
        clearErrors();
        const errorFound = checkForFieldsErrors();
        if (errorFound) {
            return;
        }
        const input = {
            title: title,
            documentCategoryId: documentCategoryId,
            file: file,
            projectId: projectId,
            authorId: user?.id,
            tags: [],
        };
        uploadFile(input)
            .then((document: Document) => {
                console.log(document);
            })
            .catch((error) => {
                console.log(error);
                setServerErrors(error.messages);
            });
    };

    useEffect(() => {
        getCategories();
    }, []);
    return (
        <Sidebar>
            <Page>
                <PageTitle title="New Document" />
                <div className="mt-[5px] flex flex-col gap-[20px]">
                    <TextField
                        onChange={(e) => setTitle(e.target.value)}
                        error={errorTitle}
                        className="w-full"
                        id="title"
                        label="Title"
                        variant="outlined"
                    />
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                    />
                    <FormControl>
                        <InputLabel id="category" error={errorDocumentCategory}>
                            Document Category
                        </InputLabel>
                        <Select
                            labelId="category-label"
                            value={documentCategoryId}
                            label="Document Category"
                            error={errorDocumentCategory}
                            onChange={(e: any) =>
                                setDocumentCategoryId(e.target.value)
                            }
                        >
                            {documentCategories &&
                                documentCategories.length > 0 &&
                                documentCategories.map((category, index) => (
                                    <MenuItem key={index} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    {!file && (
                        <Button variant="contained" component="label">
                            Choose File
                            <input
                                hidden
                                onChange={handleChangeFile}
                                multiple
                                type="file"
                            />
                        </Button>
                    )}
                    {file && (
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span>
                                    {file.name.length > 40
                                        ? file.name.substring(0, 39) + "..."
                                        : file.name}
                                </span>
                                <span className="text-[#888] text-[14px]">
                                    {(file.size / 1024).toFixed(2)} kb
                                </span>
                            </div>
                            <div>
                                <IconButton
                                    onClick={() => setFile(undefined)}
                                    component="label"
                                >
                                    <RiDeleteBin6Line />
                                </IconButton>
                            </div>
                        </div>
                    )}
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
