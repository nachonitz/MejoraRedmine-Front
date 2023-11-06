/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import { SprintFilter } from "../../../api/models/sprint";
import PrimaryButton from "../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../Shared/Buttons/SecondaryButton";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: SprintFilter;
    setFilters: (filters: SprintFilter) => void;
    onClearFilters: () => void;
}

export const SprintFiltersModal = ({
    open,
    onClose,
    filters,
    setFilters,
    onClearFilters,
}: Props) => {
    const [startDate, setStartDate] = useState<any>(
        filters.startDate ? dayjs(filters.startDate) : undefined
    );
    const [endDate, setEndDate] = useState<any>(
        filters.endDate ? dayjs(filters.endDate) : undefined
    );

    const handleApply = () => {
        setFilters({
            ...filters,
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <div className="w-[600px]">
                <DialogTitle>Filter sprints</DialogTitle>
                <DialogContent>
                    <div className="mt-[5px] flex flex-col gap-[20px]">
                        <DatePicker
                            onChange={(date) => setStartDate(date)}
                            label="Start Date"
                            value={startDate}
                        />
                        <DatePicker
                            onChange={(date) => setEndDate(date)}
                            minDate={startDate}
                            label="End Date"
                            value={endDate}
                        />
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
