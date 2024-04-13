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
import { ProjectMembership } from "../../../api/models/membership";
import { getMemberships } from "../../../api/services/membershipsService";

interface Props {
    projectId: number;
    open: boolean;
    onClose: () => void;
    filters: DocumentFilter;
    setFilters: (filters: DocumentFilter) => void;
    onClearFilters: () => void;
}

export const DocumentFiltersModal = ({
    projectId,
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
    const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
    const [authorId, setAuthorId] = useState<number | string | undefined>();

    const handleApply = () => {
        setFilters({
            ...filters,
            tags: tagsString?.split(",").map((tag) => tag.trim()),
            categoryId: documentCategoryId
                ? (documentCategoryId as number)
                : undefined,
            authorId: authorId ? (authorId as number) : undefined,
        });
        onClose();
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                if (projectId) {
                    const { data: categories } = await getEnumerations({
                        type: EnumerationType.DOCUMENT_CATEGORY,
                    });
                    const { data: resMemberships } = await getMemberships({
                        projectId,
                    });
                    setDocumentCategories(categories);
                    setMemberships(resMemberships.items);
                    if (filters.categoryId) {
                        setDocumentCategoryId(filters.categoryId);
                    }
                    if (filters.authorId) {
                        setAuthorId(filters.authorId);
                    }
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        };
        fetch();
    }, [filters.categoryId, projectId, filters.authorId]);

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
                        <FormControl fullWidth>
                            <InputLabel id="author-label">Author</InputLabel>
                            <Select
                                labelId="author-label"
                                value={authorId}
                                label="Assignee"
                                onChange={(e) => setAuthorId(e.target.value)}
                            >
                                {memberships &&
                                    memberships.map(
                                        (membership: ProjectMembership) => (
                                            <MenuItem
                                                key={membership.user.id}
                                                value={membership.user.id}
                                            >
                                                {membership.user.firstname +
                                                    " " +
                                                    membership.user.lastname}
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
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <SecondaryButton
                            onClick={() => {
                                onClearFilters();
                                onClose();
                            }}
                        >
                            Clear Filters
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={handleApply}
                            className="h-[50px]"
                        >
                            Apply
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};
