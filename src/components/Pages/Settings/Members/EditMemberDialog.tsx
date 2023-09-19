import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProjectMembership } from "../../../../api/models/membership";
import { ProjectRole } from "../../../../api/models/role";
import { getRoles } from "../../../../api/services/rolesService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../../Shared/Buttons/SecondaryButton";
import { editMembership } from "../../../../api/services/membershipsService";

interface Props {
    membership: ProjectMembership;
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

export const EditMemberDialog = ({ membership, open, onClose }: Props) => {
    const [roles, setRoles] = useState<ProjectRole[]>([]);
    const [roleNames, setRolesNames] = useState<string[]>(
        membership.roles.map((role) => role.name)
    );

    const checkForFieldsErrors = () => {
        return roleNames.length === 0;
    };

    const handleEdit = async () => {
        const selectedRoles = roles.filter((role) =>
            roleNames.includes(role.name)
        );
        const errors = checkForFieldsErrors();
        if (errors) return;
        const res = await editMembership(membership.id, {
            roleIds: selectedRoles.map((role) => role.id),
        });
        console.log({ res });
        onClose();
    };

    const handleRoleChange = (event: SelectChangeEvent<typeof roleNames>) => {
        const value = event.target.value;
        setRolesNames(typeof value === "string" ? value.split(",") : value);
    };

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
                <DialogTitle>Edit membership</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <FormControl>
                            <InputLabel id="user-label">User</InputLabel>
                            <Select
                                labelId="user-label"
                                value={membership.user.id}
                                label="User"
                                disabled
                            >
                                <MenuItem
                                    key={membership.user.id}
                                    value={membership.user.id}
                                >
                                    {membership.user.firstname}{" "}
                                    {membership.user.lastname}
                                </MenuItem>
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
                    <PrimaryButton onClick={handleEdit}>Save</PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
