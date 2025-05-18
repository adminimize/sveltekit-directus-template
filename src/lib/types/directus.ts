import { directusUsers, posts, extensionChecks } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type DirectusUser = InferSelectModel<typeof directusUsers>;
export type ExtensionCheck = InferSelectModel<typeof extensionChecks>;
export type directusUsers = typeof directusUsers;
export type Post = InferSelectModel<typeof posts>;

export type BulkData = {
    posts: Post[];
    extensionChecks: ExtensionCheck[];
    // Add more collections as needed
  };

export type BulkDataItemMap = {
  posts: Post;
  extensionChecks: ExtensionCheck;
  // Add more collections as needed
};

export const bulkDataTableNames = ['posts', 'extension_checks'] as const;