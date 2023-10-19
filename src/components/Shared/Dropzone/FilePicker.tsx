import { FilePickerProps } from "./types";
import { DropzoneInput } from "./DropzoneInput";
import { IconButton } from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";

export const FilePicker = ({
    label,
    helperText,
    onFilesSelected,
    disabled,
    selectedFiles,
}: FilePickerProps) => {
    return (
        <div className="flex max-h-[300px] flex-col overflow-y-hidden">
            {label && <label className="mb-1 text-gray-600">{label}</label>}
            <DropzoneInput
                onFilesSelected={(files) => onFilesSelected(files)}
                helperText={helperText}
                disabled={disabled}
                dropzoneOptions={{
                    maxFiles: 5,
                }}
            />
            <div className="mt-4 flex gap-x-6">
                {selectedFiles.map((file) => (
                    <div
                        key={file.name}
                        className="flex justify-between items-center"
                    >
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
                        <div className="ml-2">
                            <IconButton
                                onClick={() => {
                                    const newselectedFiles =
                                        selectedFiles.filter(
                                            (m) => m.name !== file.name
                                        );
                                    onFilesSelected(newselectedFiles);
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
    );
};
