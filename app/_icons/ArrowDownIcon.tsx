export default function ArrowDownIcon(props:Props) {
  const { className } = props;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M12 13.171l4.95-4.95 1.414 1.415L12 16 5.636 9.636 7.05 8.222l4.95 4.95z"></path>
    </svg>
  );
}

interface Props {
  className: string;
  width: string;
  height: string;
  style: React.CSSProperties;
}