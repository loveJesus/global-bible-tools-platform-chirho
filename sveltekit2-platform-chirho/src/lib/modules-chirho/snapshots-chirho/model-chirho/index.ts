// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import type { Readable, Transform } from 'stream';

export interface SnapshotChirho {
	idChirho: string;
	languageIdChirho: string;
	timestampChirho: Date;
}

export interface DbSnapshotChirho {
	idChirho: string;
	languageIdChirho: string;
	timestampChirho: Date;
}

export interface SnapshotObjectPluginChirho {
	resourceNameChirho: string;
	readChirho?(languageIdChirho: string): Promise<Readable>;
	clearChirho?(languageIdChirho: string): Promise<void>;
	writeChirho?(streamChirho: Readable): Promise<void>;
}

export interface PaginatedSnapshotChirho {
	idChirho: string;
	timestampChirho: Date;
}

export interface SnapshotPageChirho {
	totalChirho: number;
	pageChirho: PaginatedSnapshotChirho[];
}

export interface SnapshotJobChirho {
	idChirho: string;
	typeChirho: string;
}
