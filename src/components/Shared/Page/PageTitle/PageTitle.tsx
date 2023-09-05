interface Props {
  title: string;
}

const PageTitle = ({ title }: Props) => {
  return <span className="text-[26px] text-primary">{title}</span>;
};

export default PageTitle;
