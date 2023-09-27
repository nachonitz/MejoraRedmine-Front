import { ProjectMembership } from "../../../../api/models/membership";
import SettingsButton from "../../../Shared/Buttons/SettingsButton";

interface Props {
    items: ProjectMembership[];
    onEdit: () => void;
    onDelete: () => void;
    onSelected: (membership: ProjectMembership) => void;
}

export const ProjectMemberList = ({
    items,
    onEdit,
    onDelete,
    onSelected,
}: Props) => {
    return (
        <div className="w-full">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-200"
                >
                    <div className="flex items-center gap-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                            <span className="text-gray-500 text-sm">
                                {item.user.firstname[0].toUpperCase()}
                                {item.user.lastname[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">
                                {item.user.firstname} {item.user.lastname}
                            </span>
                            <span className="text-sm text-gray-500">
                                {item.user.login} | {item.user.mail}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        {item.roles.map((role) => (
                            <span
                                key={role.id}
                                className="text-sm text-gray-500 rounded bg-gray-200 px-2 py-1"
                            >
                                {role.name}
                            </span>
                        ))}
                        <SettingsButton
                            onEdit={() => {
                                onSelected(item);
                                onEdit();
                            }}
                            onDelete={() => {
                                onSelected(item);
                                onDelete();
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};
