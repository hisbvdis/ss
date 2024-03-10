import clsx from "clsx";
import { ChangeEvent, useEffect, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_utils/useDebounce";
// -----------------------------------------------------------------------------
import { Menu } from "@/app/_components/Menu";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { ArrowDownIcon, CloseIcon } from "@/app/_icons";
import styles from "./styles.module.css";


export default function Select(props:IProps) {
  const { name, value, text } = props;
  const { requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  const { onChange=(e=>e), onChangeData=(e=>e) } = props;
  const { placeholder, disabled, isAutocomplete } = props;
  const [ localItems, setLocalItems ] = useState(props.items);
  const [ suggestions, setSuggestions ] = useState(localItems ?? []);
  const [ selectedItem, setSelectedItem ] = useState(isAutocomplete ? null : localItems?.find((item) => item.id === value));
  const [ inputValue, setInputValue ] = useState(isAutocomplete ? text : selectedItem?.text);
  const [ isShowMenu, setIsShowMenu ] = useState(false);
  const debounce = useDebounce();
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {isAutocomplete ? null : setSelectedItem(localItems?.find((item) => item.id === value))}, [value]);
  useEffect(() => {isAutocomplete ? setInputValue(text) : null}, [text]);
  useEffect(() => {isAutocomplete ? null : setInputValue(selectedItem?.text)}, [selectedItem]);

  const handleInputClick = async () => {
    isAutocomplete ? setIsShowMenu(true) : setIsShowMenu(!isShowMenu);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
    isAutocomplete && setIsShowMenu(true);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = async (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (requestItemsOnInputChange) {
      if (e.target.value.length < requestMinInputLenght) return;
      debounce(async () => {
        setSuggestions(await requestItemsOnInputChange(e.target.value));
      }, 300);
      setIsShowMenu(true);
    } else {
      setSuggestions(localItems?.filter(({text}) => text.toLowerCase().includes(e.target.value?.toLowerCase())));
      setIsShowMenu(true);
    }
  }

  const handleDocumentMousedown = (e:MouseEvent) => {
    if (e.target?.closest("." + styles["select"]) === divRef.current) return;
    setIsShowMenu(false);
    setSuggestions(localItems ?? []);
    isAutocomplete ? setInputValue(text) : setInputValue(selectedItem?.text);
  }

  const handleClearBtnClick = () => {
    setInputValue("");
    onChange({target: {name, value: ""}});
    onChangeData(null);
    inputRef.current?.focus();
  }

  const handleMenuSelect = (index:number) => {
    const item = suggestions?.[index];
    // !isAutocomplete ?? setSelectedItem(item);
    onChange({target: {name, value: item?.id}});
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsShowMenu(false);
  }

  const handleInputKeydown = (e:React.KeyboardEvent<HTMLElement>) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        isAutocomplete ? setInputValue(text) : setInputValue(selectedItem?.text);
        setSuggestions(localItems ?? []);
        setIsShowMenu(false);
        break;
      }
      case "Enter": {
        (!isAutocomplete && !isShowMenu) && setIsShowMenu(true);
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete) return;
        if (isShowMenu) return;
        e.preventDefault();
        if (localItems?.length === 0 || !selectedItem || selectedItem?.index === 0) return;
        const item = localItems?.[selectedItem?.index - 1];
        setSelectedItem(item);
        onChange({target: {name, value: item?.id}});
        onChangeData(item?.data);
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete) return;
        if (isShowMenu) return;
        e.preventDefault();
        if (localItems?.length === 0 || !selectedItem || selectedItem?.index === localItems?.length - 1) return;
        const item = localItems?.[selectedItem?.index + 1];
        setSelectedItem(item);
        onChange({target: {name, value: item?.id}});
        onChangeData(item?.data);
        break;
      }
    }
  }

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      document.addEventListener("mousedown", handleDocumentMousedown);
    }
    return () => document.removeEventListener("mousedown", handleDocumentMousedown);
  })

  if (requestItemsOnInputChange && requestItemsOnFirstTouch) {
    throw new Error("Only one type of 'request' function");
  }

  return (
    <div className={clsx(styles["select"], disabled && styles["select--disabled"])} ref={divRef}>
      <p className={styles["select__inputWrapper"]}>
        <Input
          className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"])}
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeydown}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={!isAutocomplete}
        />
        {isAutocomplete ? null :
          <Button className={clsx(styles["select__btn"], styles["select__btn--arrow"])} disabled={disabled} tabIndex={-1}>
            <ArrowDownIcon
              style={{fill: disabled ? "var(--disabled-fontColor)" : "black"}}
            />
          </Button>
        }
        {isAutocomplete && value ?
          <Button className={styles["select__btn"]} onClick={handleClearBtnClick} disabled={disabled}>
            <CloseIcon
              width="15"
              height="15"
              style={{fill: disabled ? "var(--disabled-fontColor)" : "black"}}
            />
          </Button>
        : null}
      </p>
      <Menu isMenu={isShowMenu} value={value} items={suggestions} onSelect={handleMenuSelect}/>
    </div>
  )
}

interface IProps {
  isAutocomplete?: boolean;
  name?: string;
  value: string;
  text?: string;
  items: Item[];
  requestItemsOnInputChange?: (value:string) => Promise<Item[]>;
  requestItemsOnFirstTouch?: (value:string) => Promise<Item[]>;
  requestMinInputLenght?: number;
  onChange?: (e:ChangeEvent) => ChangeEvent;
  onChangeData?: (data: any) => any;
  placeholder?: string;
  disabled?: boolean;
}

interface Item {
  id: string;
  text: string;
  text2?: string;
  text3?: string;
  text4?: string;
  data?: any;
  index: number;
}