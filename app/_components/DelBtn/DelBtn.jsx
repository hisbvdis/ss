"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/Button";

export default function DelBtn(props) {
  const { id, delFunc, redirectPath } = props;
  const { children="X", style } = props;
  const router = useRouter();
  const [_, startTransition] = useTransition();

  const handleClick = async () => {
    if (!confirm("Удалить?")) return;
    await delFunc(id);
    if (redirectPath) {
      startTransition(() => {router.push(redirectPath); router.refresh()});
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
