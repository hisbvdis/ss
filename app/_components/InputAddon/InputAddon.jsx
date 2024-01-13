import "./InputAddon.css";

export default function InputAddon(props) {
  const { children } = props;

  return (
    <span className="inputAddon">
      {children}
    </span>
  )
}
