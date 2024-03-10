import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";


export default function Menu(props:IProps) {
  const { isMenu, items, value } = props;
  const { className, style } = props;
  const { onSelect } = props;
  const [ focusIndex, setFocusIndex ] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const handleDocumentKeydown = (e:KeyboardEvent) => {
    if (!["Escape", "ArrowUp", "ArrowDown", "Enter"].includes(e.code)) return;
    e.preventDefault();
    switch (e.code) {
      case "ArrowUp": {
        if (items.length === 0 || focusIndex === 0) return;
        setFocusIndex(focusIndex - 1);
        focusItemByIndex(focusIndex - 1);
        break;
      }
      case "ArrowDown": {
        if (items.length === 0 || focusIndex === items.length - 1) return;
        setFocusIndex(focusIndex + 1);
        focusItemByIndex(focusIndex + 1);
        break;
      }
      case "Enter": {
        onSelect(focusIndex);
        break;
      }
    }
  }

  const focusItemByIndex = (index:number) => {
    if (!isMenu || !listRef.current) return;
    const itemElem = listRef.current.children[index] as HTMLLIElement;
    const itemRect = listRef.current.children[index].getBoundingClientRect();
    const listRect = listRef.current.getBoundingClientRect();
    if (itemRect.top < listRect.top) listRef.current.scrollTo({top: itemElem.offsetTop});
    if (itemRect.bottom > listRect.bottom) listRef.current.scrollTo({top: itemElem.offsetTop + itemRect.height - listRect.height});
  }

  const handlePointerDown = (e:React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerId !== 1) return;
    onSelect(focusIndex);
  }

  useEffect(() => {
    if (!isMenu || !value || !items.length) return;
    const itemIndex = items.findIndex((item) => item.id === value);
    setFocusIndex(itemIndex);
    focusItemByIndex(itemIndex);
  }, [isMenu])

  useEffect(() => {
    if (isMenu) document.addEventListener("keydown", handleDocumentKeydown);
    return () => document.removeEventListener("keydown", handleDocumentKeydown);
  }, [isMenu, items, focusIndex]);

  useEffect(() => {
    setFocusIndex(0);
    items?.length && focusItemByIndex(0);
  }, [items])

  if (!isMenu) return null;
  return (
    <ul className={clsx(styles["menu"], className)} style={style} ref={listRef}>
      {items?.map(({label, label2, label3, label4}, i) => (
        <li key={i} className={clsx(styles["menu__item"], i === focusIndex && styles["menu__item--focus"])} onPointerDown={handlePointerDown} onPointerEnter={() => setFocusIndex(i)}>
          <p>{label}</p>
          <p style={{color: "#999", fontSize: "0.95em"}}>{label2}</p>
          <p style={{color: "#999", fontSize: "0.95em"}}>{label3}</p>
          <p style={{color: "#999", fontSize: "0.95em"}}>{label4}</p>
        </li>
      ))}
    </ul>
  )
}

interface IProps {
  isMenu: boolean;
  items: Item[];
  value?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onSelect: (index:number) => void;
}

interface Item {
  id?: number | string;
  label?: string;
  label2?: string;
  label3?: string;
  label4?: string;
  data?: any;
  index?: number;
}