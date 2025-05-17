import Dexie, { type Table } from 'dexie';
import type { DirectusUser } from '$lib/types/directus';

export class LocalDB extends Dexie {
  users!: Table<DirectusUser, string>;
  constructor() {
    super('LocalDB');
    this.version(1).stores({
      users: 'id,email'
    });
  }
}
export const db = new LocalDB();