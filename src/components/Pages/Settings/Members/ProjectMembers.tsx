import {
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ProjectMembership } from "../../../../api/models/membership";
import { ProjectRole } from "../../../../api/models/role";
import {
    deleteMembership,
    getMemberships,
    getMyPermissions,
} from "../../../../api/services/membershipsService";
import { getRoles } from "../../../../api/services/rolesService";
import PrimaryButton from "../../../Shared/Buttons/PrimaryButton";
import DeleteDialog from "../../../Shared/DeleteDialog/DeleteDialog";
import { Searchbar } from "../../../Shared/Searchbar/Searchbar";
import { CreateMemberDialog } from "./CreateMemberDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { ProjectMemberList } from "./ProjectMemberList";

interface Props {
    projectId: number;
}

const ALL_ROLES_ID = -1;

export const ProjectMembers = ({ projectId }: Props) => {
    const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
    const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedRole, setSelectedRole] =
        useState<ProjectRole["id"]>(ALL_ROLES_ID);
    const [openCreateMember, setOpenCreateMember] = useState(false);
    const [openEditMember, setOpenEditMember] = useState(false);
    const [openDeleteMember, setOpenDeleteMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState<ProjectMembership>();
    const [isLoading, setIsLoading] = useState(false);

    const search = async () => {
        setIsLoading(true);
        const { data } = await getMemberships({
            projectId,
            roleId: selectedRole === ALL_ROLES_ID ? undefined : selectedRole,
            search: searchText,
        });
        setIsLoading(false);
        setMemberships(data.items);
    };

    const getAllMemberships = async () => {
        const { data } = await getMemberships({ projectId });
        setMemberships(data.items);
    };

    useEffect(() => {
        const fetchProjectRoles = async () => {
            setIsLoading(true);
            const { data } = await getMemberships({
                projectId,
                roleId:
                    selectedRole === ALL_ROLES_ID ? undefined : selectedRole,
            });
            setIsLoading(false);
            setMemberships(data.items);
            await getMyPermissions();
        };
        if (projectId) fetchProjectRoles();
    }, [projectId, selectedRole]);

    useEffect(() => {
        const fetchProjectRoles = async () => {
            const roles = await getRoles();
            setProjectRoles(roles);
        };
        fetchProjectRoles();
    }, []);

    return (
        <>
            <div className="w-full mt-4">
                <div className="flex gap-x-6">
                    <FormControl className="w-[200px]">
                        <InputLabel id="priority-label">Role</InputLabel>
                        <Select
                            labelId="priority-label"
                            value={selectedRole}
                            label="Role"
                            onChange={(e) => setSelectedRole(+e.target.value)}
                        >
                            <MenuItem key={ALL_ROLES_ID} value={ALL_ROLES_ID}>
                                All Roles
                            </MenuItem>
                            {projectRoles &&
                                projectRoles.map((role: ProjectRole) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <Searchbar onChange={setSearchText} onSearch={search} />
                    <PrimaryButton onClick={() => setOpenCreateMember(true)}>
                        New Member
                    </PrimaryButton>
                </div>
                <div className="flex flex-col mt-4 gap-4">
                    <h6>Members: {memberships.length}</h6>
                    {isLoading ? (
                        <LinearProgress />
                    ) : (
                        <ProjectMemberList
                            items={memberships}
                            onSelected={(member) => setSelectedMember(member)}
                            onEdit={() => setOpenEditMember(true)}
                            onDelete={() => setOpenDeleteMember(true)}
                        />
                    )}
                </div>
            </div>
            {openCreateMember && (
                <CreateMemberDialog
                    projectId={projectId}
                    open={openCreateMember}
                    onClose={async () => {
                        setOpenCreateMember(false);
                        await getAllMemberships();
                    }}
                />
            )}
            {selectedMember && (
                <>
                    <EditMemberDialog
                        membership={selectedMember}
                        open={openEditMember}
                        onClose={async () => {
                            setOpenEditMember(false);
                            setSelectedMember(undefined);
                            await getAllMemberships();
                        }}
                    />
                    <DeleteDialog
                        open={openDeleteMember}
                        id={selectedMember.id}
                        handleClose={async () => {
                            setOpenDeleteMember(false);
                            setSelectedMember(undefined);
                            await getAllMemberships();
                        }}
                        deleteFunction={deleteMembership}
                        name={`${selectedMember.user.login}'s membership to ${selectedMember.project.name}`}
                    />
                </>
            )}
        </>
    );
};
