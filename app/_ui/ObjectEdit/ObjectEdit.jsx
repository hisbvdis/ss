"use client";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useImmer } from "use-immer";
import { syncPhotos } from "./utils/syncPhotos";
// import { setInheritedData } from "./index.js";

export default function ObjectEdit(props) {
  const [ state, setState ] = useImmer(props.init);
  useEffect(() => setState(props.init), [props.init]);
  const router = useRouter();
  const [ _, startTransition ] = useTransition();

  // useEffect(() => {
  //   setInheritedData(state.parent, setState);
  // }, [])

  const handleStateChange = (e) => {
    if (e.nativeEvent.type === "click") {
      setState((state) => {state[e.target.name] = e.target.checked});
    } else {
      setState((state) => {state[e.target.name] = e.target.value});
    }
  }

  const handleFormSubmit = async (e) => {
    const stateWithoutPhotoFiles = {...state, photos: state.photos?.map((photo) => ({...photo, file: undefined}))};
    const { id } = await upsertObject(stateWithoutPhotoFiles, props.init);
    await syncPhotos(id, state, props.init);

    if (e.nativeEvent.submitter?.dataset?.leavePage) {
      startTransition(() => {router.push(`/${state.object_type}/${id}`); router.refresh()});
    } else {
      startTransition(() => {router.replace(`/${state.object_type}/${id}/edit`, {scroll: false}); router.refresh()});
    }
  }

  return (
    null
  )
}
