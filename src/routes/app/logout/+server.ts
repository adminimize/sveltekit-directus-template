import { redirect,error } from '@sveltejs/kit';
import { PUBLIC_APIURL } from '$env/static/public';
import { getErrorMessage } from '$lib/utils/errorHandling';

export async function GET({request, cookies}) {
	try {
		if(cookies.get('refresh_token')) {
			const userAgent = request.headers.get("user-agent");
			const headers: Record<string, string> = {
				'Content-Type': 'application/json',
				...(userAgent ? { 'user-agent': userAgent } : {})
			};

			await fetch(`${PUBLIC_APIURL}/auth/logout`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ refresh_token: cookies.get('refresh_token') })
			});
		}
	} catch (err) {
		error(400, getErrorMessage(err));
	}

	cookies.delete('refresh_token', { path: '/' });
	cookies.delete('access_token', { path: '/' });

	redirect(302,`/login`);
}