let intersectionObserver: IntersectionObserver;

export function ensureIntersectionObserver() {
	if (intersectionObserver) return;

	intersectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			const eventName = entry.isIntersecting ? 'enterViewport' : 'exitViewport';
			entry.target.dispatchEvent(new CustomEvent(eventName));
		});
	});
}

export function viewport(element: HTMLElement, callback: any) {
	ensureIntersectionObserver();

	intersectionObserver.observe(element);
	element.addEventListener('enterViewport', callback);

	return {
		destroy() {
			element.removeEventListener('enterViewport', callback);
			intersectionObserver.unobserve(element);
		},
	};
}
