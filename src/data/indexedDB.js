import { openDB } from "idb";

const DATABASE_NAME = "story-app-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
  },
});

const IndexedDB = {
  async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  // ✅ untuk menyimpan semua story sekaligus
  async putStories(stories) {
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
    for (const story of stories) {
      tx.store.put(story);
    }
    await tx.done;
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async clearAllStories() {
    return (await dbPromise).clear(OBJECT_STORE_NAME);
  },
};

export default IndexedDB;
