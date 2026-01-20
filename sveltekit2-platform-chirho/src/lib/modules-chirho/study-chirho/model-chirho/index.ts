// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export interface VerseWordChirho {
	idChirho: string;
	textChirho: string;
	glossChirho?: string;
	linkedWordsChirho?: string[];
	lemmaChirho: string;
	grammarChirho: string;
	footnoteChirho?: string;
	nativeLexiconChirho?: string;
}

export interface VerseChirho {
	idChirho: string;
	numberChirho: number;
	wordsChirho: VerseWordChirho[];
}

export interface LemmaResourceChirho {
	lemmaIdChirho: string;
	nameChirho: string;
	entryChirho: string;
}
