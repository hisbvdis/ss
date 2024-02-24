"use client";
import { useImmer } from "use-immer";
import { useRouter } from "next/navigation";
import { createContext, useEffect } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/Form";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { Address, Contacts, Description, NameOrg, NamePlace, Photos, Schedule, SectionsOptions } from ".";
// -----------------------------------------------------------------------------
import { setInheritedData, syncPhotos } from "./utils";
import { upsertObject, deleteObject } from "@/app/(routes)/api/objects/requests";
import "./ObjectEdit.css";


export default function ObjectEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e) => {
      setState((state) => {state[e.target.name] = e.target.value});
    },
    checked: (e) => {
      setState((state) => {state[e.target.name] = e.target.checked});
    }
  }

  useEffect(() => {
    if (state.id || !props.parent) return;
    setInheritedData(props.parent, setState);
  }, [])

  const handleFormSubmit = async (e) => {
    const stateWithoutPhotoFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    const { id } = await upsertObject(stateWithoutPhotoFiles, props.init);
    await syncPhotos(id, state, props.init);
    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      router.push(`/object/${id}`);
    } else {
      router.replace(`/object/${id}/edit`, {scroll: false});
      router.refresh();
    }
  }

  console.log( state )

  return (
    <ObjectContext.Provider value={{state, setState, handleStateChange, setInheritedData}}>
      <Form onSubmit={handleFormSubmit} noEnterSubmit ctrlEnterSubmit noValidate>
        {state.type === "org" ? <NameOrg/> : <NamePlace/>}
        <Address/>
        <Contacts/>
        <SectionsOptions/>
        <Description/>
        <Schedule/>
        <Photos/>
        <BottomPanel
          id={state.id}
          delFunc={deleteObject}
          exitRedirectPath="./"
          delRedirectPath="/catalog"
          handleFormSubmit={handleFormSubmit}
        />
      </Form>
    </ObjectContext.Provider>
  )
}

export const ObjectContext = createContext();