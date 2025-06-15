// src/views/addStoryView.js
import L from "leaflet";

const addStoryView = {
  map: null,
  marker: null,
  onMapClick: null,
  stream: null,
  previewURL: null,

  getTemplate() {
    return `
      <div class="main-content">
        <div class="auth-container">
          <form id="form-add-story" aria-label="Add new story form" novalidate>
            <label for="description">Description:</label><br />
            <textarea id="description" name="description" placeholder="Description" required aria-describedby="desc-help"></textarea>
            <div id="desc-help">Tuliskan deskripsi cerita Anda.</div><br />

            <label for="photo-file-input">Upload Photo:</label><br />
            <input type="file" id="photo-file-input" accept="image/*" aria-label="Upload photo" /><br />

            <button type="button" id="start-camera-btn">Start Camera</button>
            <button type="button" id="capture-photo-btn" disabled>Capture Photo</button><br />

            <video id="video" autoplay width="300" height="200"></video><br />
            <canvas id="canvas" style="display: none;"></canvas>
            <img id="photo-preview" style="display: none; max-width: 300px;" alt="" /><br />

            <label for="latitude">Latitude:</label><br />
            <input type="text" id="latitude" readonly />

            <label for="longitude">Longitude:</label><br />
            <input type="text" id="longitude" readonly /><br />

            <div id="map" class="map" style="height: 300px;"></div><br />

            <button type="submit">Add Story</button>
          </form>
        </div>
      </div>
    `;
  },

  render() {
    const app = document.getElementById("app");
    app.innerHTML = this.getTemplate();

    this.previewURL && URL.revokeObjectURL(this.previewURL);
    this.previewURL = null;
    this.marker = null;
    this.stopCamera();

    this.renderMap();
    this.bindStartCamera(() => this.startCamera());
    this.bindCapturePhoto(() =>
      this.capturePhoto().then((blob) => blob && this.setPhotoPreview(blob))
    );
    this.bindPhotoFileChange((file) => {
      this.clearPhotoPreview();
      this.stopCamera();
      this.setPhotoPreview(file);
    });
  },

  renderMap() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    if (this.map) {
      this.map.off();
      this.map.remove();
    }

    const defaultLocation = [-6.2, 106.8];
    this.map = L.map(mapContainer).setView(defaultLocation, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(this.map);

    this.map.on("click", (e) => {
      this.setMarker(e.latlng);
      this.onMapClick?.(e.latlng);
    });
  },

  setMarker(latlng) {
    if (this.marker) this.marker.setLatLng(latlng);
    else this.marker = L.marker(latlng).addTo(this.map);
    this.setLatLngInputs(latlng.lat, latlng.lng);
  },

  setLatLngInputs(lat, lng) {
    document.getElementById("latitude").value = lat?.toFixed(6) || "";
    document.getElementById("longitude").value = lng?.toFixed(6) || "";
  },

  getFormData() {
    return {
      description: document.getElementById("description")?.value.trim() || "",
      lat: parseFloat(document.getElementById("latitude")?.value) || null,
      lon: parseFloat(document.getElementById("longitude")?.value) || null,
    };
  },

  bindSubmit(handler) {
    document
      .getElementById("form-add-story")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        handler(e);
      });
  },

  bindStartCamera(handler) {
    document
      .getElementById("start-camera-btn")
      ?.addEventListener("click", handler);
  },

  bindCapturePhoto(handler) {
    document
      .getElementById("capture-photo-btn")
      ?.addEventListener("click", handler);
  },

  bindPhotoFileChange(handler) {
    document
      .getElementById("photo-file-input")
      ?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) handler(file);
      });
  },

  bindMapClick(handler) {
    this.onMapClick = handler;
  },

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById("video");
      video.srcObject = this.stream;
      document.getElementById("capture-photo-btn").disabled = false;
    } catch (err) {
      alert("Camera error: " + err.message);
    }
  },

  stopCamera() {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    const video = document.getElementById("video");
    if (video) video.srcObject = null;
    document.getElementById("capture-photo-btn").disabled = true;
  },

  async capturePhoto() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), "image/jpeg")
    );
  },

  setPhotoPreview(blob) {
    const preview = document.getElementById("photo-preview");
    if (this.previewURL) URL.revokeObjectURL(this.previewURL);
    this.previewURL = URL.createObjectURL(blob);
    preview.src = this.previewURL;
    preview.style.display = "block";
  },

  clearPhotoPreview() {
    const preview = document.getElementById("photo-preview");
    preview.src = "";
    preview.style.display = "none";
    if (this.previewURL) URL.revokeObjectURL(this.previewURL);
    this.previewURL = null;
  },

  destroy() {
    this.stopCamera();
    this.clearPhotoPreview();
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = null;
    }
    this.marker = null;
    this.onMapClick = null;
  },
};

export default addStoryView;
