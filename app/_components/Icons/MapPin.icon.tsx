export default function MapPin(props:Props) {
  const { className, style, width="15", height="20", fill="#FF0000" } = props;

  return (
    <svg
      className={className}
      style={style}
      width={width}
      height={height}
      fill={fill}
      viewBox="0 0 41 54"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M40.9 20.8C40.9 9.50002 31.8 0.400024 20.5 0.400024C9.19998 0.400024 0.0999756 9.50002 0.0999756 20.8C0.0999756 32.1 20.5 53.2 20.5 53.2C20.5 53.2 40.9 32.1 40.9 20.8ZM11 20.4C11 15.2 15.3 10.9 20.5 10.9C25.7 10.9 30 15.1 30 20.4C30 25.6 25.8 29.9 20.5 29.9C15.3 29.9 11 25.6 11 20.4Z" />
    </svg>
  );
}

interface Props {
  className: string;
  style: React.CSSProperties;
  width: string;
  height: string;
  fill: string;
}