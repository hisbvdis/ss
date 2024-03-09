export default function CloseIcon(props:IProps) {
  const { width="14", height="14", style } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M6.99996 5.58599L11.95 0.635986L13.365 2.05099L8.41496 7.00099L13.365 11.951L11.95 13.365L6.99996 8.41499L2.04996 13.365L0.636963 11.95L5.58696 6.99999L0.636963 2.04999L2.04996 0.637986L6.99996 5.58799V5.58599Z"
        fill="black"
      />
    </svg>
  );
}

interface IProps {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}