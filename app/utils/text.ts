/** Minuscules + sans accents, pour des recherches tolérantes ("ete" trouve "Été"). */
export const normalizeText = (value: string): string =>
	value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();