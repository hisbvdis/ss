export default function ArrowDownIcon(props:Props) {
  const { className, width="24", height="24" } = props;

  return (
    <svg
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    >
      <path
        d="M6.9999 5.1714L11.9497 0.22168L13.3639 1.63589L6.9999 7.9999L0.635986 1.63589L2.0502 0.22168L6.9999 5.1714Z"
      />
    </svg>
  );
}

interface Props {
  className?: string;
  width?: string;
  height?: string;
  style?: React.CSSProperties;
  fill?: string;
}