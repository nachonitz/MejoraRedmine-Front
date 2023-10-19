import { DropzoneOptions } from "react-dropzone";

export interface DropzoneInputProps {
    label?: string;
    helperText?: string;
    disabled?: boolean;
    dropzoneOptions: DropzoneOptions;
    onFilesSelected: (files: File[]) => void;
}

export interface FilePickerProps {
    label?: string;
    helperText?: string;
    disabled?: boolean;
    selectedFiles: File[];
    onFilesSelected: (files: File[]) => void;
}
