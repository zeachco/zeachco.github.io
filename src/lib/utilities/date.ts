export function sortByKey<T = unknown>(key: keyof T, list: T[], missing = new Date()): T[] {
	return list.sort((a: any, b: any) => {
		const dateA = a[key] ? a[key] : missing;
		const dateB = b[key] ? b[key] : missing;
		return +dateB - +dateA;
	});
}
