import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/app/_utils/useDebounce";

import { ArrowDownIcon, CloseIcon } from "@/app/_icons";
import { Menu } from "@/app/_components/Menu";
import { Input } from "@/app/_components/Input";
import { Button } from "@/app/_components/Button";
import "./Select.css";


export default function Select(props) {
  const { name, value, label } = props;
  const { items, requestItemsOnInputChange, requestItemsOnFirstTouch, requestMinInputLenght=3 } = props;
  const { onChange=(e=>e), onChangeData=(e=>e) } = props;
  const { placeholder, disabled, isAutocomplete } = props;
  const isSelect = !isAutocomplete;
  const [ localItems, setLocalItems ] = useState(items?.map((item, index) => ({...item, index})) ?? []);
  const [ suggestions, setSuggestions ] = useState(localItems);
  const [ selectedItem, setSelectedItem ] = useState(isSelect ? localItems.find((item) => item.id === value) : null);
  const [ inputValue, setInputValue ] = useState(isSelect ? selectedItem?.label : label);
  const [ isMenu, setIsMenu ] = useState(false);
  const debounce = useDebounce();
  const inputRef = useRef();
  useEffect(() => {isSelect ? setSelectedItem(localItems.find((item) => item.id === value)) : null}, [value]);
  useEffect(() => {isAutocomplete ? setInputValue(label) : null}, [label]);
  useEffect(() => {isSelect ? setInputValue(selectedItem?.label) : null}, [selectedItem]);

  const handleInputClick = async (e) => {
    isSelect ? setIsMenu(!isMenu) : setIsMenu(true);
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputFocus = async () => {
    if (requestItemsOnFirstTouch) {
      const newItems = await requestItemsOnFirstTouch("");
      setLocalItems(newItems);
      setSuggestions(newItems);
    }
  }

  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    if (requestItemsOnInputChange) {
      if (e.target.value.length < requestMinInputLenght) return;
      debounce(async () => {
        setSuggestions(await requestItemsOnInputChange(e.target.value));
      }, 300);
      setIsMenu(true);
    } else {
      setSuggestions(localItems.filter(({label}) => label.toLowerCase().includes(e.target.value?.toLowerCase())));
      setIsMenu(true);
    }
  }

  const handleDocumentClick = (e) => {
    if (e.target?.closest(".select")) return;
    setIsMenu(false);
    setSuggestions(localItems ?? []);
    isSelect ? setInputValue(selectedItem?.label) : setInputValue(label);
  }

  const handleClearBtnClick = () => {
    setInputValue("");
    onChange({target: {name, value: ""}});
    onChangeData(null);
    inputRef.current.focus();
  }

  const handleMenuSelect = (index) => {
    const item = suggestions[index];
    isSelect ? setSelectedItem(item) : setInputValue(item?.label);
    onChange({target: {name, value: item?.id, data: item?.data}});
    onChangeData(item?.data);
    setSuggestions(localItems ?? []);
    setIsMenu(false);
  }

  const handleInputKeydown = (e) => {
    if (!["Escape", "Tab", "Enter", "ArrowUp", "ArrowDown"].includes(e.code)) return;
    switch (e.code) {
      case "Escape":
      case "Tab": {
        isSelect ? setInputValue(selectedItem?.label) : setInputValue(label);
        setSuggestions(localItems ?? []);
        setIsMenu(false);
        break;
      }
      case "Enter": {
        (isSelect && !isMenu) && setIsMenu(true);
        break;
      }
      case "ArrowUp" : {
        if (isAutocomplete) return;
        if (isMenu) return;
        e.preventDefault();
        if (localItems.length === 0 || selectedItem.index === 0) return;
        const item = localItems[selectedItem.index - 1];
        setSelectedItem(item);
        onChange({target: {name, value: item?.id, data: item?.data}});
        onChangeData(item?.data);
        break;
      }
      case "ArrowDown" : {
        if (isAutocomplete) return;
        if (isMenu) return;
        e.preventDefault();
        if (localItems.length === 0 || selectedItem.index === localItems.length - 1) return;
        const item = localItems[selectedItem.index + 1];
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
    <div className={clsx("select", disabled && "select--disabled")}>
      <p className="select__inputWrapper">
        <Input
          className={clsx("select__input", isAutocomplete && "select__input--isAutocomplete")}
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
          <Button className="select__btn  select__btn--arrow" disabled={disabled} tabIndex="-1">
            <ArrowDownIcon
              className="select__icon"
              width="15"
              height="15"
              style={{fill: disabled && "var(--disabled-fontColor)"}}
            />
          </Button>
        }
        {isAutocomplete && value ?
          <Button className="select__btn" onClick={handleClearBtnClick} disabled={disabled}>
            <CloseIcon
              className="select__icon"
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