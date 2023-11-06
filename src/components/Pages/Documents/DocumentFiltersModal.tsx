import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { DocumentFilter } from "../../../api/models/document";
import { Enumeration, EnumerationType } from "../../../api/models/enumeration";
import { getEnumerations } from "../../../api/services/enumerationsService";
import PrimaryButton from "../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../Shared/Buttons/SecondaryButton";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: DocumentFilter;
    setFilters: (filters: DocumentFilter) => void;
    onClearFilters: () => void;
}

export const DocumentFiltersModal = ({
    open,
    onClose,
    filters,
    setFilters,
    onClearFilters,
}: Props) => {
    const [tagsString, setTagsString] = useState<string | undefined>(
        filters.tags?.join(",")
    );
    const [documentCategories, setDocumentCategories] = useState<Enumeration[]>(
        []
    );
    const [documentCategoryId, setDocumentCategoryId] = useState<
        number | string
    >("");

    const handleApply = () => {
        setFilters({
            ...filters,
            tags: tagsString?.split(",").map((tag) => tag.trim()),
            categoryId: documentCategoryId
                ? (documentCategoryId as number)
                : undefined,
        });
        onClose();
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await getEnumerations({
                    type: EnumerationType.DOCUMENT_CATEGORY,
                });
                setDocumentCategories(data);
                if (filters.categoryId) {
                    setDocumentCategoryId(filters.categoryId);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        };
        getCategories();
    }, [filters.categoryId]);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[600px]">
                <DialogTitle>Filter documents</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <FormControl fullWidth>
                            <InputLabel id="category">
                                Document Category
                            </InputLabel>
                            <Select
                                labelId="category-label"
                                value={documentCategoryId}
                                label="Document Category"
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
                            className="w-full"
                            value={tagsString}
                            label="Tags"
                            placeholder="Separate tags with commas... (Max 5)"
                            variant="outlined"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <SecondaryButton
                        onClick={() => {
                            onClearFilters();
                            onClose();
                        }}
                    >
                        Clear Filters
                    </SecondaryButton>
                    <PrimaryButton onClick={handleApply} className="h-[50px]">
                        Apply
                    </PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
