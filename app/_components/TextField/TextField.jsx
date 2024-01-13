import { Control } from "../Control";
import { Input } from "../Input";


export default function TextField(props) {
  const { label, className, style } = props;
  const newProps = {...props, className: undefined, style: undefined};

  return (
    <Control label={label} className={className} style={style}>
      <Input {...newProps}/>
    </Control>
  )
}
