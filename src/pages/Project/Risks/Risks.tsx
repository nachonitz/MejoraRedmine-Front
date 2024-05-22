import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    RISK_COLOR,
    RISK_TEXT_COLOR,
    Risk,
    RiskFilter,
} from "../../../api/models/risk";
import { getMyPermissions } from "../../../api/services/membershipsService";
import { deleteRisk, getRisks } from "../../../api/services/risksService";
import CreateRiskDialog from "../../../components/Pages/Risks/CreateRiskDialog/CreateRiskDialog";
import EditRiskDialog from "../../../components/Pages/Risks/EditRiskDialog/EditRiskDialog";
import PrimaryButton from "../../../components/Shared/Buttons/PrimaryButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import { Searchbar } from "../../../components/Shared/Searchbar/Searchbar";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";
import { getFullDate, hasAccess } from "../../../lib/utils";
import SecondaryButton from "../../../components/Shared/Buttons/SecondaryButton";
import { RiskFiltersModal } from "../../../components/Pages/Risks/RiskFiltersModal";
import { Paginator } from "../../../components/Shared/Paginator/Paginator";
import { ListedResponseMetadata } from "../../../api/models/common";
import { DEFAULT_PAGINATION_DATA } from "../../../utilities/constants";
import { TableHeadItem } from "../../../components/Shared/Table/TableHeadItem";

const defaultFilters: RiskFilter = {
    page: 1,
    limit: 10,
};

const Risks = () => {
    const { projectId } = useParams();
    const [risks, setRisks] = useState<Risk[]>([]);
    const [openCreateRisk, setOpenCreateRisk] = useState(false);
    const [openEditRisk, setOpenEditRisk] = useState(false);
    const [openDeleteRisk, setOpenDeleteRisk] = useState(false);
    const [openRiskFiltersModal, setOpenRiskFiltersModal] = useState(false);
    const [selectedRisk, setSelectedRisk] = useState<Risk>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [filters, setFilters] = useState<RiskFilter>(defaultFilters);
    const [isLoading, setIsLoading] = useState(true);
    const [paginationData, setPaginationData] =
        useState<ListedResponseMetadata>(DEFAULT_PAGINATION_DATA);

    const query = useCallback(
        async (filters: RiskFilter) => {
            try {
                if (projectId) {
                    setIsLoading(true);
                    const { data } = await getRisks({
                        ...filters,
                        projectId: +projectId,
                    });
                    setIsLoading(false);
                    setRisks(data.items);
                    setPaginationData(data.meta);
                }
            } catch (error) {
                throw new Error("Error. Please try again.");
            }
        },
        [projectId]
    );

    const getUserPermissions = useCallback(async () => {
        try {
            if (projectId) {
                const allPermissions = await getMyPermissions();
                const projectPermissions = allPermissions.find(
                    (permission) => permission.projectId === +projectId
                );
                setPermissions(projectPermissions?.roles ?? []);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const handleCloseCreateRisk = (refresh?: boolean) => {
        setOpenCreateRisk(false);
        if (refresh) {
            query(filters);
        }
    };

    const handleCloseEditRisk = (refresh?: boolean) => {
        setOpenEditRisk(false);
        if (refresh) {
            query(filters);
        }
        setSelectedRisk(undefined);
    };

    const handleCloseDeleteRisk = (refresh?: boolean) => {
        setOpenDeleteRisk(false);
        if (refresh) {
            query(filters);
        }
        setSelectedRisk(undefined);
    };

    useEffect(() => {
        query(defaultFilters);
        getUserPermissions();
    }, [query, getUserPermissions]);

    useEffect(() => {
        query(filters);
    }, [filters, query]);

    return (
        <Sidebar>
            <Page>
                {openRiskFiltersModal && (
                    <RiskFiltersModal
                        open={openRiskFiltersModal}
                        onClose={() => setOpenRiskFiltersModal(false)}
                        filters={filters}
                        setFilters={setFilters}
                        onClearFilters={() => setFilters(defaultFilters)}
                    />
                )}
                {hasAccess(permissions, ["add_documents"]) && (
                    <>
                        {projectId && (
                            <CreateRiskDialog
                                projectId={projectId}
                                open={openCreateRisk}
                                handleClose={handleCloseCreateRisk}
                            />
                        )}
                        {selectedRisk && (
                            <>
                                <EditRiskDialog
                                    open={openEditRisk}
                                    riskId={selectedRisk.id}
                                    handleClose={handleCloseEditRisk}
                                />
                                <DeleteDialog
                                    open={openDeleteRisk}
                                    id={selectedRisk.id}
                                    handleClose={handleCloseDeleteRisk}
                                    deleteFunction={deleteRisk}
                                    name={selectedRisk.name}
                                />
                            </>
                        )}
                    </>
                )}
                <div className="flex justify-between items-center mb-8">
                    <PageTitle title="Risks" />
                    <div className="flex gap-x-6">
                        <SecondaryButton
                            onClick={() => setOpenRiskFiltersModal(true)}
                        >
                            Filters
                        </SecondaryButton>
                        <Searchbar
                            onChange={setSearchText}
                            onSearch={() =>
                                query({
                                    ...filters,
                                    name: searchText,
                                })
                            }
                        />
                        {hasAccess(permissions, ["add_documents"]) && (
                            <PrimaryButton
                                onClick={() => setOpenCreateRisk(true)}
                            >
                                New Risk
                            </PrimaryButton>
                        )}
                    </div>
                </div>
                <div>
                    <table className="w-full mt-[30px] border-collapse">
                        <thead>
                            <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                                <TableHeadItem
                                    attribute="name"
                                    setFilters={setFilters}
                                >
                                    Risk
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="probability"
                                    setFilters={setFilters}
                                    align="center"
                                >
                                    Probability
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="impact"
                                    setFilters={setFilters}
                                    align="center"
                                >
                                    Impact
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="level"
                                    setFilters={setFilters}
                                    align="center"
                                >
                                    Level
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="status"
                                    setFilters={setFilters}
                                    align="center"
                                >
                                    Status
                                </TableHeadItem>
                                <TableHeadItem
                                    attribute="updatedAt"
                                    setFilters={setFilters}
                                    align="center"
                                >
                                    Last updated
                                </TableHeadItem>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.map((risk: Risk) => (
                                <tr
                                    key={risk.id}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="gap-[10px] text-left">
                                        {risk.name}
                                    </td>
                                    <td
                                        style={{
                                            color: RISK_TEXT_COLOR[
                                                risk.probability
                                            ],
                                        }}
                                        className="text-center brightness-[1]"
                                    >
                                        {risk.probability}
                                    </td>
                                    <td
                                        style={{
                                            color: RISK_TEXT_COLOR[risk.impact],
                                        }}
                                        className="text-center brightness-[1]"
                                    >
                                        {risk.impact}
                                    </td>
                                    <td className="text-center">
                                        <div className="w-full flex justify-center">
                                            <div
                                                style={{
                                                    backgroundColor:
                                                        RISK_COLOR[risk.level],
                                                    color: RISK_TEXT_COLOR[
                                                        risk.level
                                                    ],
                                                }}
                                                className="rounded-[18px] p-1 bg-red-500 w-[150px] text-[16px]"
                                            >
                                                {risk.level}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {risk.status}
                                    </td>
                                    <td className="text-center">
                                        {getFullDate(risk.updatedAt)}
                                    </td>
                                    <td className="text-right">
                                        {hasAccess(permissions, [
                                            "edit_documents",
                                            "delete_documents",
                                        ]) && (
                                            <div className="flex justify-end">
                                                <SettingsButton
                                                    onEdit={() => {
                                                        setSelectedRisk(risk);
                                                        setOpenEditRisk(true);
                                                    }}
                                                    onDelete={() => {
                                                        setSelectedRisk(risk);
                                                        setOpenDeleteRisk(true);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Paginator
                        show={paginationData.totalPages > 1 && risks.length > 0}
                        page={filters.page ?? 1}
                        totalPages={paginationData.totalPages}
                        onPageChange={(page: number) =>
                            setFilters({ ...filters, page })
                        }
                    />
                    {risks.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <div className="flex justify-center items-center">
                                    <p className="text-gray-500">
                                        There are no risks yet
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default Risks;
