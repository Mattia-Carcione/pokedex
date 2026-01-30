/// <reference types="vite/client" />

declare module '@/shared/presentation/composables/useSeo' {
	export interface StructuredDataInput {
		title?: string;
		description?: string;
		url?: string;
		image?: string;
		pageType?: string;
		breadcrumb?: Array<{ name: string; url: string }>;
		extraGraph?: unknown[];
	}

	export interface PokemonStructuredDataInput {
		name: string;
		sprite?: string;
		genus?: string;
		types?: Array<{ name: string }>;
		height?: number;
		weight?: number;
	}

	export function createStructuredData(input: StructuredDataInput): Record<string, unknown>;
	export function createPokemonStructuredData(pokemon: PokemonStructuredDataInput, url?: string): Record<string, unknown> | null;
	export function setStructuredData(data: Record<string, unknown>): void;
	export function setSeoTags(input?: {
		title?: string;
		description?: string;
		image?: string;
		url?: string;
		type?: string;
		robots?: string;
		twitterCard?: string;
		locale?: string;
	}): void;
	export function applyRouteSeo(route: any): void;
}