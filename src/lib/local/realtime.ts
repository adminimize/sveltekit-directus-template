export async function initializeRealtimeSync(directus: any, collection: string, db: any, postsState?: any[]) {
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
        console.log(`[Realtime] posts event: ${event.event}`, event);

        if (event.event === 'create' || event.event === 'update') {
          const upsert = (obj: any) => {
            if (postsState) {
              const idx = postsState.findIndex((p: any) => p.id === obj.id);
              if (idx !== -1) {
                postsState[idx] = obj;
              } else {
                postsState.push(obj);
              }
            }
            db.posts.put(obj);
            console.log(`[Realtime] Upserted post:`, obj);
          };
          if (Array.isArray(event.data)) {
            for (const obj of event.data) upsert(obj);
          } else if (event.data && event.data.id) {
            upsert(event.data);
          } else {
            console.warn('Received create/update event with unexpected data:', event);
          }
        } else if (event.event === 'delete') {
          const remove = (id: any) => {
            if (postsState) {
              const idx = postsState.findIndex((p: any) => p.id === id);
              if (idx !== -1) postsState.splice(idx, 1);
            }
            db.posts.delete(id);
            console.log(`[Realtime] Deleted post with id: ${id}`);
          };
          if (Array.isArray(event.data)) {
            for (const id of event.data) remove(id);
          } else if (event.data && event.data.id) {
            remove(event.data.id);
          } else {
            console.warn('Received delete event with unexpected data:', event);
          }
        }
      }
    } catch (err) {
      console.error('Directus realtime subscription error:', err);
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

