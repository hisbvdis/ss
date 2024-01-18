export const syncPhotos = async (id, state, init) => {
  const photosToDelete = init.photos?.length > 0 && init.photos.filter((initPhoto) => !state.photos.some((statePhoto) => statePhoto.localId === initPhoto.localId));
  const photosToUpload = state.photos?.length > 0 && state.photos.filter((statePhoto) => !init.photos?.some((initPhoto) => initPhoto.localId === statePhoto.localId));

  // 1. First — delete photos
  if (photosToDelete.length > 0) {
    const formData = new FormData();
    photosToDelete.forEach(({name}) => {
      formData.append("name", name);
    });
    await fetch("/api/photos", { method: "DELETE", body: formData });
  }

  // 2. Upload new photos after deleting old ones
  if (photosToUpload.length > 0) {
    const formData = new FormData();
    photosToUpload.forEach(({file, name}) => {
      formData.append("file", file);
      formData.append("name", name.replace("ID", id));
    });
    await fetch("/api/photos", { method: "POST", body: formData });
  }
}
