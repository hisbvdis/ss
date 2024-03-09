"use client";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { IObject } from "@/app/_types/types";
import { ChangeEvent, SyntheticEvent, createContext, useEffect, useState } from "react";
// -----------------------------------------------------------------------------
import { Form } from "@/app/_components/Form";
import { BottomPanel } from "@/app/_ui/BottomPanel";
import { Address, Contacts, Description, NameOrg, NamePlace, Photos, Schedule, SectionsOptions, setInheritedData, syncPhotos } from ".";
// -----------------------------------------------------------------------------
import "./styles.css";
import { deleteObjectById, upsertObject } from "@/app/_db/object";


export default function ObjectEdit(props: {init: IObject, parent?: IObject}) {
  const [ state, setState ] = useState(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();

  const handleStateChange = {
    value: (e:ChangeEvent<HTMLInputElement>) => {
      setState(produce(state, (draft) => {draft[e.target.name] = e.target.value}));
    },
    checked: (e:ChangeEvent<HTMLInputElement>) => {
      setState(produce(state, (draft) => {draft[e.target.name] = e.target.checked}))
    }
  }

  useEffect(() => {
    if (state.id || !props.parent) return;
    setInheritedData(props.parent, setState);
  }, [])

  const handleFormSubmit = async (e:SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
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

  return (
    <ObjectEditContext.Provider value={{state, setState, handleStateChange, setInheritedData}}>
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
          delFunc={deleteObjectById}
          exitRedirectPath="./"
          delRedirectPath="/catalog"
        />
      </Form>
    </ObjectEditContext.Provider>
  )
}

export const ObjectEditContext = createContext({});