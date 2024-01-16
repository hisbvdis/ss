"use client";
import { useContext, useState } from "react";
// -----------------------------------------------------------------------------
import { ObjectContext } from "./ObjectEdit";
import { Card } from "@/app/_components/Card";
import { Button } from "@/app/_components/Button";


export default function Photos(props) {
  const { state, setState } = useContext(ObjectContext);
  const [ dragoNode, setDragoNode ] = useState();

  const handlePhotos = {
    add: (e) => {
      const statePhotos = state?.photos ?? [];
      const existingIndexes = statePhotos.map(({name}) => name.match(/\d(?=\.webp)/g)?.[0]).map((index) => Number(index));
      const newIndexes = Array(10).fill().map((_, i) => i).filter((i) => !existingIndexes.includes(i)).toSorted((a,b) => a-b);
      const addedPhotos = Array.from(e.target.files).slice(0, 10 - statePhotos.length).map((file) => ({localId: crypto.randomUUID(), name: `org_${state.id ?? "ID"}_${newIndexes.shift()}.webp`, file, blob: URL.createObjectURL(file)}));
      const allPhotos = statePhotos.concat(addedPhotos).map((photo, i) => ({...photo, order: i}));
      setState((state) => {state.photos = allPhotos});
    },

    delete: (localId) => {
      setState((state) => {state.photos = state.photos.filter((photo) => photo.localId !== localId)});
    },

    deleteAll: () => {
      setState((state) => {state.photos = []});
    },

    drag: (e) => {
      const dropzoneNode = e.target.closest("li");
      if (dropzoneNode.dataset.localid === dragoNode.dataset.localid) return;
      const dropzoneCenterX = dropzoneNode.getBoundingClientRect().left + dropzoneNode.getBoundingClientRect().width / 2;
      const dropzoneIndex = Number(dropzoneNode.dataset.i);
      const dragoState = state.photos.find((photo) => photo.localId === dragoNode.dataset.localid);
      if (e.clientX < dropzoneCenterX) {
        setState((state) => {
          state.photos = state.photos.filter(({localId}) => localId !== dragoNode.dataset.localid).toSpliced(dropzoneIndex, 0, dragoState);
          state.photos = state.photos.map((photo, i) => ({...photo, order: i}))
        })
      } else if (e.clientX > dropzoneCenterX) {
        setState((state) => {
          state.photos = state.photos.filter(({localId}) => localId !== dragoNode.dataset.localid).toSpliced(dropzoneIndex + 1, 0, dragoState);
          state.photos = state.photos.map((photo, i) => ({...photo, order: i}))
        });
      }
    }
  }

  return (
    <Card className="mt10">
      <Card.Heading>
        <span>Фотографии</span>
        <Button onClick={handlePhotos.deleteAll}>Удалить все</Button>
      </Card.Heading>
      <Card.Section>
        <input type="file" onChange={handlePhotos.add} multiple/>
        <ul style={{display: "flex", gap: "15px", listStyle: "none", paddingInlineStart: 0, flexWrap: "wrap"}}>
          {state.photos?.map(({localId, blob, name}, i) => (
            <li key={localId} data-localid={localId} data-i={i} onDragOver={(e) => handlePhotos.drag(e)} onDragStart={(e) => setDragoNode(e.target.closest("li"))}>
              <Button onClick={() => handlePhotos.delete(localId)} style={{position: "absolute"}}>X</Button>
              <img className="objectEdit__photo" src={blob ?? `/photos/${name}`}/>
            </li>
          ))}
        </ul>
      </Card.Section>
    </Card>
  )
}
