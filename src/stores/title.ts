import { writable } from 'svelte/store';

function createTitle() {
	const {subscribe, set, update} = writable('');

	return {
		subscribe,
		set: (value: string) => {
			set(`${value} • Hacktoberfest Tracking`)
		},
		clear: () => {
			set('Hacktoberfest Tracking');
		}
	}
}

export const title = createTitle();