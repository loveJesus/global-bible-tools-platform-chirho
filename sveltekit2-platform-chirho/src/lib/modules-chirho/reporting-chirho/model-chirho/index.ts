// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

export interface LanguageContributionsChirho {
	weekChirho: Date;
	usersChirho: Array<{ userIdChirho: string; glossesChirho: number }>;
}

export interface ReportingContributionChirho {
	idChirho: string;
	weekChirho: Date;
	languageIdChirho: string;
	userIdChirho: string;
	approvedCountChirho: number;
	revokedCountChirho: number;
	editedApprovedCountChirho: number;
	editedUnapprovedCountChirho: number;
}

export interface ReportingUserChirho {
	idChirho: string;
	nameChirho: string;
	emailChirho: string;
	statusChirho: string;
}

export interface ReportingLanguageChirho {
	idChirho: string;
	nameChirho: string;
	codeChirho: string;
}

export interface ReportingBookChirho {
	idChirho: string;
	nameChirho: string;
	wordCountChirho: number;
}

export interface ReportingProgressSnapshotChirho {
	idChirho: string;
	weekChirho: Date;
	languageIdChirho: string;
	userIdChirho?: string;
	bookIdChirho: string;
	approvedCountChirho: string;
	unapprovedCountChirho: string;
}

export interface ApprovalStatsChirho {
	chunkIdChirho: number;
	languageIdChirho: string;
	methodChirho: string;
	chunkCountChirho: number;
	cumulativeCountChirho: number;
	languageChirho: string;
}

export interface DbTrackingEventChirho<DataChirho = unknown> {
	idChirho: string;
	typeChirho: string;
	dataChirho: DataChirho;
	userIdChirho?: string | null;
	languageIdChirho?: string | null;
	createdAtChirho: Date;
}
