export interface CatalogSection {
	id: string;
	name: string;
	icon: string;
}

export const CATALOG_SECTIONS: [CatalogSection, ...CatalogSection[]] = [
	{ id: 'decorations', name: "Décorations d'Avatar", icon: 'lucide:square-user' },
	{ id: 'effects', name: 'Effets de Profil', icon: 'lucide:wand-sparkles' },
	{ id: 'nameplates', name: 'Plaques nominatives', icon: 'lucide:tag' },
	{ id: 'frames', name: 'Cadre de Profil', icon: 'lucide:square-dashed' },
];

export const useCatalogNavigation = () => {
	const activeTab = useState<string>('catalog-active-tab', () => 'decorations');

	return {
		sections: CATALOG_SECTIONS,
		activeTab,
	};
};