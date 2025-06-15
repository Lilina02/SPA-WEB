function showLoading(container) {
  container.innerHTML = `
    <main id="main-content">
      <h1>Stories</h1>
      <p>Loading stories...</p>
    </main>
  `;
}

function showError(container, error) {
  container.innerHTML = `
    <main id="main-content">
      <h1>Stories</h1>
      <p>Error loading stories: ${error.message}</p>
    </main>
  `;
}

function showEmpty(container) {
  container.innerHTML = `
    <main id="main-content">
      <h1>Stories</h1>
      <p>No stories available.</p>
    </main>
  `;
}

function showStories(container, stories) {
  container.innerHTML = `
    <main id="main-content" class="stories-container">
      <h1>Stories</h1>
      <ul class="story-list" role="list">
        ${stories.map((story) => {
          const createdAt = new Date(story.createdAt);
          const tanggal = isNaN(createdAt) ? 'Unknown' : createdAt.toLocaleString();
          const name = story.name || 'Unknown';
          const description = story.description || '-';
          const photoUrl = story.photoUrl || '';

          return `
          <li class="story-item" tabindex="0" data-id="${story.id}">
            <div class="story-content">
              <img src="${photoUrl}" alt="Story from ${name}" class="story-image" />
              <p><strong>Tanggal:</strong> ${tanggal}</p>
              <p><strong>Nama User:</strong> ${name}</p>
              <p><strong>Deskripsi:</strong> ${description}</p>
            </div>
            <div id="map-${story.id}" class="story-map" style="height: 150px;"></div>
          </li>
          `;
        }).join('')}
      </ul>
    </main>
  `;
}

function renderMaps(stories, maps) {
  stories.forEach((story) => {
    const mapContainer = document.getElementById(`map-${story.id}`);
    if (!mapContainer) return;

    if (
      typeof story.lat !== 'number' || isNaN(story.lat) ||
      typeof story.lon !== 'number' || isNaN(story.lon)
    ) {
      return;
    }

    const map = L.map(mapContainer).setView([story.lat, story.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([story.lat, story.lon])
      .addTo(map)
      .bindPopup(`<b>${story.name}</b><br>${story.description}`);

    maps.set(story.id, map);
  });
}

function showNotLoggedIn(container) {
  container.innerHTML = `
    <main id="main-content">
      <h1>Stories</h1>
      <p>Anda belum login. Silakan login terlebih dahulu.</p>
    </main>
  `;
}

export default {
  showLoading,
  showError,
  showEmpty,
  showStories,
  renderMaps,
  showNotLoggedIn,
};
