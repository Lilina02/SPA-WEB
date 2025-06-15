export default function addStoryPresenter(view, model) {
  let photoFile = null;
  let latitude = null;
  let longitude = null;

  const init = async () => {
    view.render();
    view.bindSubmit(handleSubmit);
    view.bindCapturePhoto(handleCapturePhoto);
    view.bindPhotoFileChange(handlePhotoFileChange);
    view.bindMapClick(({ lat, lng }) => {
      latitude = lat;
      longitude = lng;
      view.setLatLngInputs(lat, lng);
    });
    await view.startCamera();
    window.addEventListener("hashchange", destroy);
  };

  function handleCapturePhoto() {
    view.capturePhoto().then((blob) => {
      if (blob) {
        photoFile = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        view.setPhotoPreview(blob);
      }
    });
  }

  function handlePhotoFileChange(file) {
    if (file) {
      photoFile = file;
      view.setPhotoPreview(file);
    }
  }

  async function handleSubmit() {
    const { description, lat, lon } = view.getFormData();
    if (!description || lat === null || lon === null || !photoFile) {
      alert("Lengkapi semua data terlebih dahulu.");
      return;
    }
    try {
      await model.addStory({ description, lat, lon, photo: photoFile });
      alert("Cerita berhasil ditambahkan!");
      window.location.hash = "#/";
    } catch (err) {
      alert("Gagal menambahkan cerita: " + err.message);
    }
  }

  const destroy = () => {
    view.destroy();
    window.removeEventListener("hashchange", destroy);
  };

  init();
  return { destroy };
}
