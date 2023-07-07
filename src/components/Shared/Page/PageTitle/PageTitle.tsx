import { MdAdd } from 'react-icons/md';

interface PageTitleProps {
    title: string;
}

const PageTitle: React.FC<PageTitleProps> = ( { title } ) => {

    return (
        <>
            <span className="text-[26px] text-primary">{ title }</span>
        </>
    )
}

export default PageTitle;