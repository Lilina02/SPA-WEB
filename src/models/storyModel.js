class StoryModel {
  constructor(api) {
    this.api = api;
    this.stories = [];
  }

  getToken() {
    return localStorage.getItem('token') || null;
  }

  async loadStories() {
    const token = this.getToken();
    if (!token) throw new Error('User not authenticated');
    this.stories = await this.api.fetchStories(token);
  }

  getStories() {
    return this.stories;
  }

  async addStory(story) {
    const token = this.getToken();
    if (!token) throw new Error('User not authenticated');
    return await this.api.addStory(story, token);
  }

  async deleteStory(storyId) {
    const token = this.getToken();
    if (!token) throw new Error('User not authenticated');
    return await this.api.deleteStory(storyId, token);
  }

  async editStory(storyId, updatedData) {
    const token = this.getToken();
    if (!token) throw new Error('User not authenticated');
    return await this.api.editStory(storyId, updatedData, token);
  }
}

export default StoryModel;