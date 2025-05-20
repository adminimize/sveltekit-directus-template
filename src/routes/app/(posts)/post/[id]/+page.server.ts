import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    console.log("post page data", params);
    return { params };
}