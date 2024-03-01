export default function CloseIcon(props:Props) {
  const { width="24", height="24", className } = props;

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
    >
      <path d="M12 10.586l4.95-4.95 1.415 1.415-4.95 4.95 4.95 4.95-1.415 1.414-4.95-4.95-4.95 4.95-1.413-1.415 4.95-4.95-4.95-4.95L7.05 5.638l4.95 4.95z"></path>
    </svg>
  );
}

interface Props {
  width: string;
  height: string;
  className: string;
  style: React.CSSProperties;
}