/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    SelectChangeEvent,
    OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProjectRole } from "../../../../api/models/role";
import { User } from "../../../../api/models/user";
import { getUsers } from "../../../../api/services/usersService";
import { getRoles } from "../../../../api/services/rolesService";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import { createMembership } from "../../../../api/services/membershipsService";
import { errorToast, successToast } from "../../../Shared/Toast";

interface Props {
    projectId: number;
    open: boolean;
    onClose: () => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const CreateMemberDialog = ({ projectId, open, onClose }: Props) => {
    const [userId, setUserId] = useState<number>();
    const [roleNames, setRolesNames] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<ProjectRole[]>([]);

    const checkForFieldsErrors = () => {
        return !userId || roleNames.length === 0;
    };

    const handleCreate = async () => {
        const selectedRoles = roles.filter((role) =>
            roleNames.includes(role.name)
        );
        const errors = checkForFieldsErrors();
        if (errors) return;
        const res = await createMembership({
            projectId,
            userId: userId!,
            roleIds: selectedRoles.map((role) => role.id),
        });
        if (res.status === 201 || res.status === 200) {
            successToast("Membership created successfully");
        } else {
            errorToast("Something went wrong");
        }
        onClose();
    };

    const handleRoleChange = (event: SelectChangeEvent<typeof roleNames>) => {
        const value = event.target.value;
        setRolesNames(typeof value === "string" ? value.split(",") : value);
    };

    useEffect(() => {
        const fetch = async () => {
            const { data } = await getUsers({});
            setUsers(data.items);
        };
        fetch();
    }, []);

    useEffect(() => {
        const fetch = async () => {
            const roles = await getRoles();
            setRoles(roles);
        };
        fetch();
    }, []);

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[600px]">
                <DialogTitle>Create membership</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <FormControl>
                            <InputLabel id="user-label">User</InputLabel>
                            <Select
                                labelId="user-label"
                                value={userId}
                                label="User"
                                onChange={(e) => setUserId(+e.target.value)}
                            >
                                {users &&
                                    users.map((user: User) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.firstname} {user.lastname}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                multiple
                                value={roleNames}
                                onChange={handleRoleChange}
                                input={<OutlinedInput label="Tag" />}
                                renderValue={(selected) => selected.join(", ")}
                                MenuProps={MenuProps}
                            >
                                {roles &&
                                    roles.map((role: ProjectRole) => (
                                        <MenuItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            <Checkbox
                                                checked={
                                                    roleNames.indexOf(
                                                        role.name
                                                    ) > -1
                                                }
                                            />
                                            <ListItemText primary={role.name} />
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <PrimaryButton onClick={handleCreate}>Create</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
