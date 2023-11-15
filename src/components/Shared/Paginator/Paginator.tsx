import { Pagination } from "@mui/material";

interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    show?: boolean;
}

export const Paginator = ({ page, totalPages, onPageChange, show }: Props) => {
    const onChange = (_: React.ChangeEvent<unknown>, page: number) => {
        onPageChange(page);
    };
    if (!show) return <></>;
    return (
        <div className="w-full flex mt-8">
            <Pagination
                count={totalPages}
                color="primary"
                page={page}
                onChange={onChange}
            />
        </div>
    );
};
