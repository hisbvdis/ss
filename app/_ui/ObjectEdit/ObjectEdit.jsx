"use client";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useTransition } from "react";
import { useImmer } from "use-immer";
// -----------------------------------------------------------------------------
import { syncPhotos } from "./utils/syncPhotos";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/Form";
import { Address, Contacts, Description, NameOrg, NamePlace, Schedule, SectionsOptions } from ".";
// import { setInheritedData } from "./index.js";
import "./ObjectEdit.css";

export default function ObjectEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();
  const [ _, startTransition ] = useTransition();

  // useEffect(() => {
  //   setInheritedData(state.parent, setState);
  // }, [])

  const handleStateChange = (e) => {
    setState((state) => {state[e.target.name] = e.target.value});
  }

  const handleFormSubmit = async (e) => {
    const stateWithoutPhotoFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    const { id } = await upsertObject(stateWithoutPhotoFiles, props.init);
    await syncPhotos(id, state, props.init);

    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      startTransition(() => {router.push(`/${state.type}/${id}`); router.refresh()});
    } else {
      startTransition(() => {router.replace(`/${state.type}/${id}/edit`, {scroll: false}); router.refresh()});
    }
  }

  return (
    <ObjectContext.Provider value={{state, setState, handleStateChange}}>
      <Form>
        {state.type === "org" ? <NameOrg/> : <NamePlace/>}
        <Address/>
        {/* <Contacts/> */}
        {/* <SectionsOptions/> */}
        {/* <Description/> */}
        <Schedule/>
      </Form>
    </ObjectContext.Provider>
  )
}

export const ObjectContext = createContext();