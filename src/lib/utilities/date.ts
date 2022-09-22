export function sortByDate<T = unknown>(key: keyof T, list: T[], missing = new Date()): T[] {
	return list.sort((a: any, b: any) => {
		const dateA = a[key] ? new Date(a[key]) : missing;
		const dateB = b[key] ? new Date(b[key]) : missing;
		return +dateB - +dateA;
	});
}
