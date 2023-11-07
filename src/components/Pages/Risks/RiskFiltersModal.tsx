import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from "@mui/material";
import {
    RiskEnumeration,
    RiskFilter,
    RiskLevel,
    RiskStatus,
} from "../../../api/models/risk";
import { useState } from "react";
import SecondaryButton from "../../Shared/Buttons/SecondaryButton";
import PrimaryButton from "../../Shared/Buttons/PrimaryButton";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: RiskFilter;
    setFilters: (filters: RiskFilter) => void;
    onClearFilters: () => void;
}

export const RiskFiltersModal = ({
    open,
    onClose,
    filters,
    setFilters,
    onClearFilters,
}: Props) => {
    const [probability, setProbability] = useState<RiskEnumeration | undefined>(
        filters.probability
    );
    const [impact, setImpact] = useState<RiskEnumeration | undefined>(
        filters.impact
    );
    const [status, setStatus] = useState<RiskStatus | undefined>(
        filters.status
    );
    const [level, setLevel] = useState<RiskLevel | undefined>(filters.level);

    const handleApply = () => {
        setFilters({
            ...filters,
            probability,
            impact,
            status,
            level,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[600px]">
                <DialogTitle>Filter risks</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <FormControl fullWidth>
                            <InputLabel id="probability-label">
                                Probability
                            </InputLabel>
                            <Select
                                labelId="probability-label"
                                id="probability"
                                value={probability}
                                label="Probability"
                                onChange={(e) =>
                                    setProbability(
                                        e.target.value as RiskEnumeration
                                    )
                                }
                            >
                                {Object.entries(RiskEnumeration).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="impact-label">Impact</InputLabel>
                            <Select
                                labelId="impact-label"
                                id="impact"
                                value={impact}
                                label="Impact"
                                onChange={(e) =>
                                    setImpact(e.target.value as RiskEnumeration)
                                }
                            >
                                {Object.entries(RiskEnumeration).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                id="status"
                                value={status}
                                label="Status"
                                onChange={(e) =>
                                    setStatus(e.target.value as RiskStatus)
                                }
                            >
                                {Object.entries(RiskStatus).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="level-label">Level</InputLabel>
                            <Select
                                labelId="level-label"
                                id="level"
                                value={level}
                                label="Level"
                                onChange={(e) =>
                                    setLevel(e.target.value as RiskLevel)
                                }
                            >
                                {Object.entries(RiskLevel).map(
                                    ([key, value]) => (
                                        <MenuItem key={key} value={value}>
                                            {value}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                    <SecondaryButton
                        onClick={() => {
                            onClearFilters();
                            onClose();
                        }}
                    >
                        Clear Filters
                    </SecondaryButton>
                    <PrimaryButton onClick={handleApply} className="h-[50px]">
                        Apply
                    </PrimaryButton>
                </DialogActions>
            </div>
        </Dialog>
    );
};
