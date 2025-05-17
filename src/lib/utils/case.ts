// src/lib/utils/case.ts
export function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function keysToCamelCase<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map(keysToCamelCase) as any;
	}
	if (obj && typeof obj === 'object' && obj.constructor === Object) {
		const newObj: any = {};
		for (const [key, value] of Object.entries(obj)) {
			newObj[toCamelCase(key)] = keysToCamelCase(value);
		}
		return newObj;
	}
	return obj;
}