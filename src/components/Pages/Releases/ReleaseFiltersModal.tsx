/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { ReleaseFilter } from "../../../api/models/release";
import PrimaryButton from "../../Shared/Buttons/PrimaryButton";
import SecondaryButton from "../../Shared/Buttons/SecondaryButton";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    onClose: () => void;
    filters: ReleaseFilter;
    setFilters: (filters: ReleaseFilter) => void;
    onClearFilters: () => void;
}

export const ReleaseFiltersModal = ({
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
        <Dialog fullWidth={true} open={open} onClose={onClose}>
            <div>
                <DialogTitle>Filter releases</DialogTitle>
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
                <div className="px-4 mb-4">
                    <DialogActions>
                        <SecondaryButton onClick={onClose}>
                            Close
                        </SecondaryButton>
                        <SecondaryButton
                            onClick={() => {
                                onClearFilters();
                                onClose();
                            }}
                        >
                            Clear Filters
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={handleApply}
                            className="h-[50px]"
                        >
                            Apply
                        </PrimaryButton>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};
