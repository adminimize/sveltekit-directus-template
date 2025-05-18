import { updateItem, createItem, deleteItem } from '@directus/sdk';

export async function initializeRealtimeSync(directus: any, collection: string, db: any, stateArray?: any[]) {
  let unsubscribed = false;
  let subscriptions: AsyncIterableIterator<any>[] = [];

  // Ensure websocket is connected before subscribing
  if (directus.connect) {
    await directus.connect();
  }

  // Helper to subscribe to a single event type
  async function subscribeToEvent(eventType: 'create' | 'update' | 'delete') {
    try {
      const { subscription } = await directus.subscribe(collection, { event: eventType, query: {
        fields: ["*"],
      }, });
      subscriptions.push(subscription);

      for await (const event of subscription) {
        if (unsubscribed) break;
        console.log(`[Realtime] [${collection}] event: ${event.event}`, event);

        if (event.event === 'create' || event.event === 'update') {
          const upsert = (obj: any) => {
            if (stateArray) {
              const idx = stateArray.findIndex((p: any) => p.id === obj.id);
              if (idx !== -1) {
                stateArray[idx] = obj;
              } else {
                stateArray.push(obj);
              }
            }
            db[collection].put(obj);
            console.log(`[Realtime] [${collection}] Upserted:`, obj);
          };
          if (Array.isArray(event.data)) {
            for (const obj of event.data) upsert(obj);
          } else if (event.data && event.data.id) {
            upsert(event.data);
          } else {
            console.warn(`[Realtime] [${collection}] Received create/update event with unexpected data:`, event);
          }
        } else if (event.event === 'delete') {
          const remove = (id: any) => {
            if (stateArray) {
              const idx = stateArray.findIndex((p: any) => p.id === id);
              if (idx !== -1) stateArray.splice(idx, 1);
            }
            db[collection].delete(id);
            console.log(`[Realtime] [${collection}] Deleted with id: ${id}`);
          };
          if (Array.isArray(event.data)) {
            for (const id of event.data) remove(id);
          } else if (event.data && event.data.id) {
            remove(event.data.id);
          } else {
            console.warn(`[Realtime] [${collection}] Received delete event with unexpected data:`, event);
          }
        }
      }
    } catch (err) {
      console.error(`[Realtime] [${collection}] subscription error:`, err);
    }
  }

  // Start subscriptions for all event types
  subscribeToEvent('create');
  subscribeToEvent('update');
  subscribeToEvent('delete');

  // Teardown function
  return () => {
    unsubscribed = true;
    for (const sub of subscriptions) {
      if (sub && sub.return) sub.return();
    }
  };
}

// src/lib/local/realtime.ts

// Debounce helper for per-record debouncing
const debounceMap = new Map<string, ReturnType<typeof setTimeout>>();
function debounceById(id: string, fn: () => void, delay = 500) {
  if (debounceMap.has(id)) {
    clearTimeout(debounceMap.get(id));
  }
  debounceMap.set(id, setTimeout(fn, delay));
}

export function syncDexieToDirectus(db: any, directus: any, collection: string) {
  // CREATE
  db[collection].hook('creating', async (_primKey: any, obj: any, _transaction: any) => {
    if (!obj.__local_modified) return;
    console.log('[Dexie CREATE hook] Triggered for', obj);
    debounceById(obj.id, async () => {
      try {
        const payload = stripLocalFields(obj);
        console.log('[Dexie CREATE hook] Debounced, sending to Directus:', payload);
        await directus.request(createItem(collection as string, payload));
        obj.__local_modified = false;
        console.log(`[Sync] Created in Directus:`, obj);
      } catch (err) {
        console.error(`[Sync] Error creating in Directus:`, err, obj);
      }
    });
  });

  // UPDATE
  db[collection].hook('updating', async (mods: any, primKey: any, obj: any, _transaction: any) => {
    console.log('[Dexie UPDATE hook] Called');
    console.log('[Dexie UPDATE hook] primKey:', primKey);
    console.log('[Dexie UPDATE hook] obj (before):', obj);
    console.log('[Dexie UPDATE hook] mods:', mods);
    if (!mods.__local_modified) {
      console.log('[Dexie UPDATE hook] Skipped: __local_modified is not true in mods');
      return;
    }
    debounceById(primKey, async () => {
      try {
        const payload = stripLocalFields(mods);
        console.log('[Dexie UPDATE hook] Debounced, sending to Directus:', payload);
        await directus.request(updateItem(collection as string, primKey, payload));
        obj.__local_modified = false;
        console.log(`[Sync] Updated in Directus:`, primKey, mods);
      } catch (err) {
        console.error(`[Sync] Error updating in Directus:`, err, primKey, mods);
      }
    });
  });

  // DELETE
  db[collection].hook('deleting', async (primKey: any, _obj: any, _transaction: any) => {
    console.log('[Dexie DELETE hook] Triggered for', primKey);
    try {
      await directus.request(deleteItem(collection as string, primKey));
      console.log(`[Sync] Deleted in Directus:`, primKey);
    } catch (err) {
      console.error(`[Sync] Error deleting in Directus:`, err, primKey);
    }
  });
}

function stripLocalFields(obj: any) {
  const { __local_modified, ...rest } = obj;
  return rest;
}

