import Dexie, { type Table } from 'dexie';
import type { Post, ExtensionCheck, DirectusUser } from '$lib/types/directus';

export class LocalDB extends Dexie {
  posts!: Table<Post, string>;
  extensionChecks!: Table<ExtensionCheck, string>;
  users!: Table<DirectusUser, string>;
  // Add more tables as needed

  constructor() {
    super('LocalDB');
    this.version(1).stores({
      posts: 'id,title',
      extensionChecks: 'id',
      users: 'id,email',
      // Add more stores as needed
    });
  }
}

export const db = new LocalDB();