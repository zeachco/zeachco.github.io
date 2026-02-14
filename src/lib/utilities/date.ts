export function sortByKey<T = unknown>(key: keyof T, list: T[], missing = new Date()): T[] {
	return [...list].sort((a: any, b: any) => {
		const dateA = a[key] ? a[key] : missing;
		const dateB = b[key] ? b[key] : missing;
		return +dateB - +dateA;
	});
}

/**
 * Formats a duration between two dates into a human-readable string
 * @param start - Start date
 * @param end - End date
 * @returns Formatted string like "2 years and 3 months", "1 year", "5 months"
 */
export function formatDuration(start: Date, end: Date): string {
	const startYear = start.getFullYear();
	const startMonth = start.getMonth();
	const endYear = end.getFullYear();
	const endMonth = end.getMonth();

	// Calculate total months
	const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

	// Convert to years and months
	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	// Build the formatted string
	const parts: string[] = [];

	if (years > 0) {
		parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
	}

	if (months > 0) {
		parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
	}

	// Handle edge case where duration is less than a month
	if (parts.length === 0) {
		return 'less than a month';
	}

	return parts.join(' and ');
}
