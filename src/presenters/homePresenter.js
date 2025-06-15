import IndexedDB from "../data/indexedDB.js";

export default async function HomePresenter(container, model, view) {
  const maps = new Map();

  function clearMaps() {
    for (const map of maps.values()) {
      map.remove();
    }
    maps.clear();
  }

  async function renderStories() {
    try {
      const token = model.getToken();
      if (!token) {
        view.showNotLoggedIn(container);
        return;
      }

      view.showLoading(container);

      await model.loadStories();
      const stories = model.getStories();

      // ✅ Simpan ke IndexedDB untuk akses offline
      await IndexedDB.putStories(stories);

      if (!stories || stories.length === 0) {
        view.showEmpty(container);
        return;
      }

      view.showStories(container, stories);
      clearMaps();
      view.renderMaps(stories, maps);
    } catch (error) {
      console.warn(
        "Gagal ambil data dari API. Menggunakan data offline dari IndexedDB."
      );

      try {
        const stories = await IndexedDB.getAllStories(); // atau getStories()

        if (!stories || stories.length === 0) {
          view.showEmpty(container);
          return;
        }

        view.showStories(container, stories);
        clearMaps();
        view.renderMaps(stories, maps);
      } catch (e) {
        console.error("Gagal mengambil data dari IndexedDB:", e);
        view.showError(container, e);
      }
    }
  }

  await renderStories();
}
