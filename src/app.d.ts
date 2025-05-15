import type { DirectusUser } from '@directus/sdk';

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: string | null;
			session: DirectusSession | null | undefined;
			token: string | null;
		}
	}
}

export {};
