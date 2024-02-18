"use client";
import { useRouter } from "next/navigation";
// -----------------------------------------------------------------------------
import { Button } from "../Button";

export default function DelBtn(props:Props) {
  const router = useRouter();
  const { id, delFunc, redirectPath } = props;
  const { style, children="X" } = props;

  const handleClick = async () => {
    if (!confirm("Удалить?")) return;
    await delFunc(id);
    if (redirectPath) {
      router.push(redirectPath);
      router.refresh()
    } else {
      router.refresh();
    }
  }

  return (
    <Button onClick={handleClick} style={style}>
      {children}
    </Button>
  )
}

interface Props {
  id: number;
  delFunc: (id:number) => Promise<any>;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  redirectPath?: string;
}