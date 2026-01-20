// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type {
	LanguageChirho as LanguageDbChirho,
	LanguageMemberChirho as LanguageMemberDbChirho
} from '$lib/server/schema-chirho';

export type LanguageChirho = LanguageDbChirho;
export type LanguageMemberChirho = LanguageMemberDbChirho;

export enum TextDirectionRawChirho {
	LtrChirho = 'ltr',
	RtlChirho = 'rtl'
}

export class LanguageAlreadyExistsErrorChirho extends Error {
	constructor(public codeChirho: string) {
		super(`Language with code ${codeChirho} already exists`);
		this.name = 'LanguageAlreadyExistsErrorChirho';
	}
}

export class SourceLanguageMissingErrorChirho extends Error {
	constructor(public languageIdChirho: string) {
		super(`Source language ${languageIdChirho} is missing`);
		this.name = 'SourceLanguageMissingErrorChirho';
	}
}

export class LanguageNotFoundErrorChirho extends Error {
	constructor() {
		super('Language not found');
		this.name = 'LanguageNotFoundErrorChirho';
	}
}
