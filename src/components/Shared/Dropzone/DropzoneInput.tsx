import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DropzoneInputProps } from "./types";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const focusedStyle = { borderColor: "#2196f3" };
const acceptStyle = { borderColor: "#00e676" };
const rejectStyle = { borderColor: "#ff1744" };

export const DropzoneInput = ({
    label,
    helperText,
    disabled,
    dropzoneOptions,
    onFilesSelected,
}: DropzoneInputProps) => {
    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
        acceptedFiles,
    } = useDropzone(dropzoneOptions);
    const [fileAmount, setFileAmount] = useState(0);

    useEffect(() => {
        if (acceptedFiles.length > 0 && fileAmount === 0) {
            onFilesSelected(acceptedFiles);
            setFileAmount(acceptedFiles.length);
        } else if (acceptedFiles.length === 0) {
            setFileAmount(0);
        }
    }, [acceptedFiles, onFilesSelected, fileAmount]);

    const style = useMemo(
        () => ({
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    return (
        <div className="flex flex-col">
            {label && (
                <label
                    className={cn(
                        "mb-1 font-medium",
                        disabled ? "text-gray-400" : "text-gray-900"
                    )}
                >
                    {label}
                </label>
            )}
            <div
                {...getRootProps({ style })}
                className="rounded-2 flex flex-1 cursor-pointer items-center justify-center 
        border-2 border-dashed border-gray-300 bg-gray-100 p-20 
        text-center text-gray-400 outline-none transition duration-300 ease-in-out"
            >
                <input {...getInputProps()} />
                <p>{helperText ?? "Selecciona una imagen"}</p>
            </div>
        </div>
    );
};
