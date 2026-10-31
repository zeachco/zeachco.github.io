/**
 * The visitor simulation, as a separate module the SPA loads on demand (see
 * the root layout). The site itself is the game: the module watches the
 * visitor's actions (hover, navigation, text selection, scrolling, clicks)
 * and trains a small linear network — the same architecture as the phantom
 * game brains — to predict five probabilities from them: staying 10/30/60
 * seconds, clicking the CV download, clicking another link.
 *
 * Every event is saved to localStorage the moment it happens (input vector +
 * label), the network trains on it, and the trained weights persist across
 * visits. Nothing ever leaves the browser.
 *
 * Debug: window.__visitorSim → { probabilities, snapshot, samples, navigate, dispose }
 */

export { initVisitorSim, type VisitorSim, type NetworkSnapshot } from './simulation';
export { initSimRenderer } from './renderer';
export {
	NeuralNetwork,
	Level,
	teachingRate,
	clampToRange,
	quantize,
	isSaveShapeValid,
	type SavedNetwork,
	type OutputRange,
	type OutputRanges,
} from './network';
export {
	FeatureState,
	INPUT_COUNT,
	OUTPUT_COUNT,
	HIDDEN_LAYER_COUNT,
	HIDDEN_LAYER_SIZE,
	LAYER_SIZES,
	INPUT_NAMES,
	OUTPUT_NAMES,
	OUTPUT_RANGES,
	STAY_THRESHOLDS_MS,
	WINDOW_MS,
	PAGES,
	type ActionKind,
} from './features';
