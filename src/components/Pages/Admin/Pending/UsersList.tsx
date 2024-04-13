import { Tooltip } from "@mui/material";
import { useContext, useState } from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { ListedResponseMetadata } from "../../../../api/models/common";
import { PendingUser, UserFilter } from "../../../../api/models/user";
import { approveUser } from "../../../../api/services/usersService";
import { UsersContext } from "../../../../context/UsersContext";
import { getFullDate } from "../../../../lib/utils";
import { DEFAULT_PAGINATION_DATA } from "../../../../utilities/constants";
import { Paginator } from "../../../Shared/Paginator/Paginator";
import { errorToast, successToast } from "../../../Shared/Toast";

interface Props {
    items: PendingUser[];
}

const defaultFilters: UserFilter = {
    page: 1,
    limit: 10,
};

export const UsersList = ({ items }: Props) => {
    const { getUsers, getPendingUsers } = useContext(UsersContext);
    const [filters, setFilters] = useState<UserFilter>(defaultFilters);
    const [paginationData, _setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

    const approve = async (id: number, approved: boolean) => {
        try {
            const res = await approveUser(id, approved);
            if (res) {
                successToast(approved ? "User approved" : "User deleted");
                await getPendingUsers();
                await getUsers(defaultFilters);
            } else {
                errorToast("Something went wrong");
            }
        } catch (error: any) {
            const message =
                error?.messages.length > 0
                    ? error.messages[0]
                    : "Something went wrong";
            errorToast(message);
        }
    };

    return (
        <div>
            <div>
                {items && items.length > 0 && (
                    <div>
                        <table className="w-full mt-[10px]" cellPadding={5}>
                            <thead>
                                <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                    <th className="text-left">User</th>
                                    <th className="text-left">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items &&
                                    items.map((user: PendingUser) => (
                                        <tr
                                            key={user.id}
                                            className="text-[18px] border-b-[1px] hover:bg-gray-50"
                                        >
                                            <td className="gap-[10px] text-left">
                                                <div className="flex items-center gap-x-4">
                                                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                                                        <span className="text-gray-500 text-sm">
                                                            {user.firstname[0].toUpperCase()}
                                                            {user.lastname[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {user.firstname}{" "}
                                                            {user.lastname}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {user.login} |{" "}
                                                            {user.mail}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-left">
                                                {getFullDate(user.created_on)}
                                            </td>
                                            <td className="text-right">
                                                <div className="flex justify-end">
                                                    <div className="flex gap-2">
                                                        <Tooltip
                                                            title={`Activate`}
                                                        >
                                                            <div
                                                                onClick={() => {
                                                                    approve(
                                                                        user.id,
                                                                        true
                                                                    );
                                                                }}
                                                                className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9] cursor-pointer flex justify-center items-center"
                                                            >
                                                                <IoMdCheckmark className="text-black" />
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={`Delete`}
                                                        >
                                                            <div
                                                                onClick={() => {
                                                                    approve(
                                                                        user.id,
                                                                        false
                                                                    );
                                                                }}
                                                                className="w-[26px] h-[26px] rounded-full bg-[#d9d9d9] cursor-pointer flex justify-center items-center"
                                                            >
                                                                <IoMdClose className="text-black" />
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        <Paginator
                            show={
                                paginationData.totalPages > 1 &&
                                items.length > 0
                            }
                            page={filters.page ?? 1}
                            totalPages={paginationData.totalPages}
                            onPageChange={(page: number) =>
                                setFilters({ ...filters, page })
                            }
                        />
                    </div>
                )}
                {items.length === 0 && (
                    <div className="text-[18px] h-[40px] w-full text-center mt-2">
                        <div className="flex justify-center items-center">
                            <p className="text-gray-500">
                                There are no pending users
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
