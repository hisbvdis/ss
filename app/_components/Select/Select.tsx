import clsx from "clsx";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
// -----------------------------------------------------------------------------
import { useDebounce } from "@/app/_utils/useDebounce";
// -----------------------------------------------------------------------------
import { Menu } from "@/app/_components/Menu";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import { ArrowDownIcon, CloseIcon } from "@/app/_icons";
import styles from "./Select.module.css";


export default function Select(props:Props) {
  const { name, value, text } = props;
  const { items, requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  const { onChange=(e=>e), onChangeData=(e=>e) } = props;
  const { placeholder, disabled, isAutocomplete } = props;
  const [ localItems, setLocalItems ] = useState<Item[]>(items?.map((item, index) => ({...item, index})) ?? []);
  const [ suggestions, setSuggestions ] = useState(localItems);
  const [ selectedItem, setSelectedItem ] = useState(isAutocomplete ? null : localItems.find((item) => item.id === value));
  const [ inputValue, setInputValue ] = useState(isAutocomplete ? text : selectedItem?.text);
  const [ isMenu, setIsMenu ] = useState(false);
  const debounce = useDebounce();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  useEffect(() => {isAutocomplete ? null : setSelectedItem(localItems.find((item) => item.id === value))}, [value]);
  useEffect(() => {isAutocomplete ? setInputValue(text) : null}, [text]);
  useEffect(() => {isAutocomplete ? null : setInputValue(selectedItem?.text)}, [selectedItem]);

  const handleInputClick = async () => {
    isAutocomplete ? setIsMenu(true) : setIsMenu(!isMenu)
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
    isAutocomplete ? setIsMenu(true) : setIsMenu(!isMenu)
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
      setIsMenu(true);
    } else {
      setSuggestions(localItems.filter(({text}) => text.toLowerCase().includes(e.target.value?.toLowerCase())));
      setIsMenu(true);
    }
  }

  const handleDocumentClick = (e:MouseEvent) => {
    if ((e.target as HTMLElement).closest(".select")) return;
    setIsMenu(false);
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
    const item = suggestions[index];
    isAutocomplete ? setInputValue(item?.text) : setSelectedItem(item);
    onChange({target: {name, value: item?.id, data: item?.data}});
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsMenu(false);
  }

  const handleInputKeydown = (e:React.KeyboardEvent<Element>) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        isAutocomplete ? setInputValue(text) : setInputValue(selectedItem?.text);
        setSuggestions(localItems ?? []);
        setIsMenu(false);
        break;
      }
      case "Enter": {
        (!isAutocomplete && !isMenu) && setIsMenu(true);
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete) return;
        if (isMenu) return;
        e.preventDefault();
        if (localItems.length === 0 || !selectedItem || selectedItem?.index === 0) return;
        const item = localItems[selectedItem?.index - 1];
        setSelectedItem(item);
        onChange({target: {name, value: item?.id, data: item?.data}});
        onChangeData(item?.data);
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete) return;
        if (isMenu) return;
        e.preventDefault();
        if (localItems.length === 0 || !selectedItem || selectedItem?.index === localItems.length - 1) return;
        const item = localItems[selectedItem?.index + 1];
        setSelectedItem(item);
        onChange({target: {name, value: item?.id, data: item?.data}});
        onChangeData(item?.data);
        break;
      }
    }
  }

  useEffect(() => {
    if (inputRef.current === document.activeElement) {
      document.addEventListener("click", handleDocumentClick);
    }
    return () => document.removeEventListener("click", handleDocumentClick);
  })

  if (requestItemsOnInputChange && requestItemsOnFirstTouch) {
    throw new Error("Only one type of 'request' function");
  }

  return (
    <div className={clsx(styles["select"], disabled && styles["select--disabled"])}>
      <p className={styles["select__inputWrapper"]}>
        <Input
          className={clsx(styles["select__input"], isAutocomplete && styles["select__input--isAutocomplete"])}
          id={inputId}
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
              className={styles["select__icon"]}
              width="15"
              height="15"
              style={{fill: disabled && "var(--disabled-fontColor)"}}
            />
          </Button>
        }
        {isAutocomplete && value ?
          <Button className={styles["select__btn"]} onClick={handleClearBtnClick} disabled={disabled}>
            <CloseIcon
              className={styles["select__icon"]}
              width="15"
              height="15"
              style={{fill: disabled && "var(--disabled-fontColor)"}}
            />
          </Button>
        : null}
      </p>
      <Menu isMenu={isMenu} value={value} items={suggestions} onSelect={handleMenuSelect}/>
    </div>
  )
}

interface Props {
  isAutocomplete?: boolean;
  name?: string;
  value: string;
  text?: string;
  items?: Item[];
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