const storyApi = (() => {
  const baseUrl = 'https://story-api.dicoding.dev/v1/stories';

  async function fetchStories(token) {
    const response = await fetch(baseUrl, {
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!response.ok) throw new Error('Failed to fetch stories');
    const data = await response.json();
    return data.listStory || [];
  }

  async function addStory({ description, lat, lon, photo }, token) {
    if (!description) throw new Error('"description" is required');
    if (!photo) throw new Error('"photo" is required');

    const formData = new FormData();
    formData.append('description', description);
    if (lat !== undefined && lat !== null) formData.append('lat', lat);
    if (lon !== undefined && lon !== null) formData.append('lon', lon);
    formData.append('photo', photo);

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add story');
    }

    return response.json();
  }

  // ❗ Catatan: Fungsi ini tidak didukung oleh Dicoding Story API asli
  async function deleteStory(storyId, token) {
    const response = await fetch(`${baseUrl}/${storyId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete story');
    }

    return response.json();
  }

  // ❗ Catatan: Fungsi ini tidak didukung oleh Dicoding Story API asli
  async function editStory(storyId, updatedData, token) {
    if (
      !updatedData.description &&
      (updatedData.lat === undefined || updatedData.lat === null) &&
      (updatedData.lon === undefined || updatedData.lon === null) &&
      !updatedData.photo
    ) {
      throw new Error('At least one field is required to update');
    }

    const formData = new FormData();
    if (updatedData.description) formData.append('description', updatedData.description);
    if (updatedData.lat !== undefined && updatedData.lat !== null) formData.append('lat', updatedData.lat);
    if (updatedData.lon !== undefined && updatedData.lon !== null) formData.append('lon', updatedData.lon);
    if (updatedData.photo) formData.append('photo', updatedData.photo);

    const response = await fetch(`${baseUrl}/${storyId}`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update story');
    }

    return response.json();
  }

  return { fetchStories, addStory, deleteStory, editStory };
})();

export default storyApi;
