// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export enum GlossStateRawChirho {
	ApprovedChirho = 'APPROVED',
	UnapprovedChirho = 'UNAPPROVED'
}

export enum GlossSourceRawChirho {
	UserChirho = 'USER',
	ImportChirho = 'IMPORT'
}

export enum GlossApprovalMethodRawChirho {
	UserInputChirho = 'USER_INPUT',
	GoogleSuggestionChirho = 'GOOGLE_SUGGESTION',
	MachineSuggestionChirho = 'MACHINE_SUGGESTION'
}

export interface DbGlossChirho {
	glossChirho: string | null;
	stateChirho: GlossStateRawChirho;
	updatedAtChirho: Date;
	updatedByChirho: string | null;
	phraseIdChirho: number;
	sourceChirho: GlossSourceRawChirho | null;
}

export interface DbGlossHistoryEntryChirho {
	idChirho: number;
	glossChirho: string | null;
	stateChirho: GlossStateRawChirho;
	updatedAtChirho: Date;
	updatedByChirho: string | null;
	phraseIdChirho: number;
	sourceChirho: GlossSourceRawChirho | null;
}

export interface UpdateGlossOptionsChirho {
	phraseIdChirho: number;
	updatedByChirho: string | null;
	sourceChirho: GlossSourceRawChirho | null;
	glossChirho?: string | null;
	stateChirho?: GlossStateRawChirho;
}

export interface ApproveManyGlossesOptionsChirho {
	updatedByChirho: string | null;
	phrasesChirho: Array<{ glossChirho: string | null; phraseIdChirho: number }>;
}

export interface DbPhraseChirho {
	idChirho: number;
	languageIdChirho: string;
	createdAtChirho: Date;
	createdByChirho?: string | null;
	deletedAtChirho?: Date | null;
	deletedByChirho?: string | null;
}

export interface DbPhraseWordChirho {
	phraseIdChirho: string;
	wordIdChirho: string;
}

export interface PhraseChirho {
	idChirho: number;
	createdAtChirho: Date;
	createdByChirho?: string | null;
	deletedAtChirho?: Date | null;
	deletedByChirho?: string | null;
	languageChirho: {
		idChirho: string;
		codeChirho: string;
	};
	wordIdsChirho: string[];
}
