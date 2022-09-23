const updates = new Map();
let currentAnimation = 0;

function animateAll() {
	currentAnimation = requestAnimationFrame(animateAll);
	updates.forEach((anim) => anim());
}

export function startAnimation(name: string, cb: Function) {
	updates.set(name, cb);
	if (!currentAnimation) {
		animateAll();
	}
}

export function stopAnimation(name: string) {
	updates.delete(name);
	if (!updates.size) {
		cancelAnimationFrame(currentAnimation);
		currentAnimation = 0;
	}
}
