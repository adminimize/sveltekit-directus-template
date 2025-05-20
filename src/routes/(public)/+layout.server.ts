import { getPublicSiteData } from "$lib/directus";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    const data = await getPublicSiteData();
    return { ...data };
}