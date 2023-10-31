import { LinearProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RISK_COLOR, Risk, RiskFilter } from "../../../api/models/risk";
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
    const [selectedRisk, setSelectedRisk] = useState<Risk>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const getAllRisks = useCallback(async () => {
        try {
            if (projectId) {
                const { data } = await getRisks({
                    ...defaultFilters,
                    projectId: +projectId,
                });
                setIsLoading(false);
                setRisks(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    }, [projectId]);

    const search = async () => {
        try {
            if (projectId) {
                setIsLoading(true);
                const { data } = await getRisks({
                    ...defaultFilters,
                    name: searchText,
                    projectId: +projectId,
                });
                setIsLoading(false);
                setRisks(data.items);
            }
        } catch (error) {
            throw new Error("Error. Please try again.");
        }
    };

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
            getAllRisks();
        }
    };

    const handleCloseEditRisk = (refresh?: boolean) => {
        setOpenEditRisk(false);
        if (refresh) {
            getAllRisks();
        }
        setSelectedRisk(undefined);
    };

    const handleCloseDeleteRisk = (refresh?: boolean) => {
        setOpenDeleteRisk(false);
        if (refresh) {
            getAllRisks();
        }
        setSelectedRisk(undefined);
    };

    useEffect(() => {
        getAllRisks();
        getUserPermissions();
    }, [getAllRisks, getUserPermissions]);

    return (
        <Sidebar>
            <Page>
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
                        <Searchbar onChange={setSearchText} onSearch={search} />
                        {hasAccess(permissions, ["add_documents"]) && (
                            <PrimaryButton
                                onClick={() => {
                                    setOpenCreateRisk(true);
                                }}
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
                                <th className="text-center">Risk</th>
                                <th className="text-center">Probability</th>
                                <th className="text-center">Impact</th>
                                <th className="text-center">Level</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Last updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.map((risk: Risk) => (
                                <tr
                                    key={risk.id}
                                    onClick={() => {
                                        console.log(risk.id);
                                    }}
                                    className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                                >
                                    <td className="gap-[10px] text-left">
                                        {risk.name}
                                    </td>
                                    <td
                                        style={{
                                            color: RISK_COLOR[risk.probability],
                                        }}
                                        className="text-center"
                                    >
                                        {risk.probability}
                                    </td>
                                    <td
                                        style={{
                                            color: RISK_COLOR[risk.impact],
                                        }}
                                        className="text-center"
                                    >
                                        {risk.impact}
                                    </td>
                                    <td className="text-center">
                                        <div className="w-full flex justify-center">
                                            <div
                                                style={{
                                                    backgroundColor:
                                                        RISK_COLOR[risk.level],
                                                }}
                                                className="rounded-[18px] p-1 bg-red-500 text-white w-[120px]"
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
                    {risks.length === 0 && (
                        <div className="text-[18px] h-[40px] w-full text-center mt-2">
                            {isLoading ? (
                                <LinearProgress />
                            ) : (
                                <span className="text-center">
                                    There are no risks yet.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Page>
        </Sidebar>
    );
};

export default Risks;
