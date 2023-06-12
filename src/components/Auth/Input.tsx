import { ChangeEvent, KeyboardEvent } from "react";

interface CustomInputProps {
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: any) => void;
    onKeyPress: (e: any) => void;
    error?: boolean;
}
const Input: React.FC<CustomInputProps> = ({ type, name, placeholder, value, onChange, onKeyPress, error }) => {
    return (
        <div>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                required
                className={`w-full p-3 border border-gray-300 rounded ${error && 'border-red-700'}`}
            />
        </div>
    )
}

export default Input;