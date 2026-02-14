/**
 * Normalizes text by removing accents and converting to lowercase
 * @param text The text to normalize
 * @returns Normalized text without accents and in lowercase
 */
export function normalizeText(text: string): string {
	return text
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}
