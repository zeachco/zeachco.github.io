import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { roles, type Role } from '$lib/types';

function createSelectedRolesStore() {
	// Initialize with all roles or from localStorage if available
	const getInitialValue = (): Role[] => {
		if (!browser) return [...roles];

		const stored = localStorage.getItem('selectedRoles');
		if (stored) {
			try {
				const parsed = JSON.parse(stored) as Role[];
				return parsed.length > 0 ? parsed : [...roles];
			} catch {
				return [...roles];
			}
		}
		return [...roles];
	};

	const { subscribe, set, update } = writable<Role[]>(getInitialValue());

	// Sync to localStorage when the store changes
	if (browser) {
		subscribe((value) => {
			localStorage.setItem('selectedRoles', JSON.stringify(value));
		});

		// Listen for storage changes from other tabs/windows
		window.addEventListener('storage', (e) => {
			if (e.key === 'selectedRoles' && e.newValue) {
				try {
					const parsed = JSON.parse(e.newValue) as Role[];
					set(parsed.length > 0 ? parsed : [...roles]);
				} catch {
					// Ignore parse errors
				}
			}
		});
	}

	return {
		subscribe,
		set,
		update,
		reset: () => set([...roles])
	};
}

export const selectedRoles = createSelectedRolesStore();
