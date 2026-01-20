// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { relations } from 'drizzle-orm';

// Bible tables
import {
	bookTableChirho,
	verseTableChirho,
	wordTableChirho,
	lemmaTableChirho,
	lemmaFormTableChirho,
	lemmaResourceTableChirho
} from './bible-chirho';

// User tables
import {
	userTableChirho,
	sessionTableChirho,
	userSystemRoleTableChirho,
	userInvitationTableChirho,
	userEmailVerificationTableChirho,
	resetPasswordTokenTableChirho
} from './users-chirho';

// Language tables
import {
	languageTableChirho,
	languageMemberTableChirho,
	languageMemberRoleTableChirho,
	languageImportJobTableChirho
} from './languages-chirho';

// Translation tables
import {
	phraseTableChirho,
	phraseWordTableChirho,
	glossTableChirho,
	glossHistoryTableChirho,
	machineGlossTableChirho,
	footnoteTableChirho,
	translatorNoteTableChirho
} from './translation-chirho';

// ============================================================================
// Bible Relations
// ============================================================================

export const bookRelationsChirho = relations(bookTableChirho, ({ many }) => ({
	versesChirho: many(verseTableChirho)
}));

export const verseRelationsChirho = relations(verseTableChirho, ({ one, many }) => ({
	bookChirho: one(bookTableChirho, {
		fields: [verseTableChirho.bookIdChirho],
		references: [bookTableChirho.idChirho]
	}),
	wordsChirho: many(wordTableChirho)
}));

export const wordRelationsChirho = relations(wordTableChirho, ({ one, many }) => ({
	verseChirho: one(verseTableChirho, {
		fields: [wordTableChirho.verseIdChirho],
		references: [verseTableChirho.idChirho]
	}),
	formChirho: one(lemmaFormTableChirho, {
		fields: [wordTableChirho.formIdChirho],
		references: [lemmaFormTableChirho.idChirho]
	}),
	phraseWordsChirho: many(phraseWordTableChirho),
	machineGlossesChirho: many(machineGlossTableChirho)
}));

export const lemmaRelationsChirho = relations(lemmaTableChirho, ({ many }) => ({
	formsChirho: many(lemmaFormTableChirho),
	resourcesChirho: many(lemmaResourceTableChirho)
}));

export const lemmaFormRelationsChirho = relations(lemmaFormTableChirho, ({ one, many }) => ({
	lemmaChirho: one(lemmaTableChirho, {
		fields: [lemmaFormTableChirho.lemmaIdChirho],
		references: [lemmaTableChirho.idChirho]
	}),
	wordsChirho: many(wordTableChirho)
}));

export const lemmaResourceRelationsChirho = relations(lemmaResourceTableChirho, ({ one }) => ({
	lemmaChirho: one(lemmaTableChirho, {
		fields: [lemmaResourceTableChirho.lemmaIdChirho],
		references: [lemmaTableChirho.idChirho]
	})
}));

// ============================================================================
// User Relations
// ============================================================================

export const userRelationsChirho = relations(userTableChirho, ({ many }) => ({
	sessionsChirho: many(sessionTableChirho),
	systemRolesChirho: many(userSystemRoleTableChirho),
	invitationsChirho: many(userInvitationTableChirho),
	emailVerificationsChirho: many(userEmailVerificationTableChirho),
	resetPasswordTokensChirho: many(resetPasswordTokenTableChirho),
	languageMembershipsChirho: many(languageMemberTableChirho),
	languageRolesChirho: many(languageMemberRoleTableChirho),
	createdPhrasesChirho: many(phraseTableChirho, { relationName: 'createdByChirho' }),
	deletedPhrasesChirho: many(phraseTableChirho, { relationName: 'deletedByChirho' }),
	updatedGlossesChirho: many(glossTableChirho),
	glossHistoryChirho: many(glossHistoryTableChirho),
	footnotesChirho: many(footnoteTableChirho),
	translatorNotesChirho: many(translatorNoteTableChirho),
	importJobsChirho: many(languageImportJobTableChirho)
}));

export const sessionRelationsChirho = relations(sessionTableChirho, ({ one }) => ({
	userChirho: one(userTableChirho, {
		fields: [sessionTableChirho.userIdChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const userSystemRoleRelationsChirho = relations(userSystemRoleTableChirho, ({ one }) => ({
	userChirho: one(userTableChirho, {
		fields: [userSystemRoleTableChirho.userIdChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const userInvitationRelationsChirho = relations(userInvitationTableChirho, ({ one }) => ({
	userChirho: one(userTableChirho, {
		fields: [userInvitationTableChirho.userIdChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const userEmailVerificationRelationsChirho = relations(
	userEmailVerificationTableChirho,
	({ one }) => ({
		userChirho: one(userTableChirho, {
			fields: [userEmailVerificationTableChirho.userIdChirho],
			references: [userTableChirho.idChirho]
		})
	})
);

export const resetPasswordTokenRelationsChirho = relations(
	resetPasswordTokenTableChirho,
	({ one }) => ({
		userChirho: one(userTableChirho, {
			fields: [resetPasswordTokenTableChirho.userIdChirho],
			references: [userTableChirho.idChirho]
		})
	})
);

// ============================================================================
// Language Relations
// ============================================================================

export const languageRelationsChirho = relations(languageTableChirho, ({ one, many }) => ({
	referenceLanguageChirho: one(languageTableChirho, {
		fields: [languageTableChirho.referenceLanguageIdChirho],
		references: [languageTableChirho.idChirho]
	}),
	membersChirho: many(languageMemberTableChirho),
	memberRolesChirho: many(languageMemberRoleTableChirho),
	phrasesChirho: many(phraseTableChirho),
	machineGlossesChirho: many(machineGlossTableChirho),
	importJobsChirho: many(languageImportJobTableChirho)
}));

export const languageMemberRelationsChirho = relations(languageMemberTableChirho, ({ one }) => ({
	languageChirho: one(languageTableChirho, {
		fields: [languageMemberTableChirho.languageIdChirho],
		references: [languageTableChirho.idChirho]
	}),
	userChirho: one(userTableChirho, {
		fields: [languageMemberTableChirho.userIdChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const languageMemberRoleRelationsChirho = relations(
	languageMemberRoleTableChirho,
	({ one }) => ({
		languageChirho: one(languageTableChirho, {
			fields: [languageMemberRoleTableChirho.languageIdChirho],
			references: [languageTableChirho.idChirho]
		}),
		userChirho: one(userTableChirho, {
			fields: [languageMemberRoleTableChirho.userIdChirho],
			references: [userTableChirho.idChirho]
		})
	})
);

export const languageImportJobRelationsChirho = relations(
	languageImportJobTableChirho,
	({ one }) => ({
		languageChirho: one(languageTableChirho, {
			fields: [languageImportJobTableChirho.languageIdChirho],
			references: [languageTableChirho.idChirho]
		}),
		userChirho: one(userTableChirho, {
			fields: [languageImportJobTableChirho.userIdChirho],
			references: [userTableChirho.idChirho]
		})
	})
);

// ============================================================================
// Translation Relations
// ============================================================================

export const phraseRelationsChirho = relations(phraseTableChirho, ({ one, many }) => ({
	languageChirho: one(languageTableChirho, {
		fields: [phraseTableChirho.languageIdChirho],
		references: [languageTableChirho.idChirho]
	}),
	createdByUserChirho: one(userTableChirho, {
		fields: [phraseTableChirho.createdByChirho],
		references: [userTableChirho.idChirho],
		relationName: 'createdByChirho'
	}),
	deletedByUserChirho: one(userTableChirho, {
		fields: [phraseTableChirho.deletedByChirho],
		references: [userTableChirho.idChirho],
		relationName: 'deletedByChirho'
	}),
	phraseWordsChirho: many(phraseWordTableChirho),
	glossChirho: one(glossTableChirho),
	glossHistoryChirho: many(glossHistoryTableChirho),
	footnotesChirho: many(footnoteTableChirho),
	translatorNotesChirho: many(translatorNoteTableChirho)
}));

export const phraseWordRelationsChirho = relations(phraseWordTableChirho, ({ one }) => ({
	phraseChirho: one(phraseTableChirho, {
		fields: [phraseWordTableChirho.phraseIdChirho],
		references: [phraseTableChirho.idChirho]
	}),
	wordChirho: one(wordTableChirho, {
		fields: [phraseWordTableChirho.wordIdChirho],
		references: [wordTableChirho.idChirho]
	})
}));

export const glossRelationsChirho = relations(glossTableChirho, ({ one }) => ({
	phraseChirho: one(phraseTableChirho, {
		fields: [glossTableChirho.phraseIdChirho],
		references: [phraseTableChirho.idChirho]
	}),
	updatedByUserChirho: one(userTableChirho, {
		fields: [glossTableChirho.updatedByChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const glossHistoryRelationsChirho = relations(glossHistoryTableChirho, ({ one }) => ({
	phraseChirho: one(phraseTableChirho, {
		fields: [glossHistoryTableChirho.phraseIdChirho],
		references: [phraseTableChirho.idChirho]
	}),
	updatedByUserChirho: one(userTableChirho, {
		fields: [glossHistoryTableChirho.updatedByChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const machineGlossRelationsChirho = relations(machineGlossTableChirho, ({ one }) => ({
	wordChirho: one(wordTableChirho, {
		fields: [machineGlossTableChirho.wordIdChirho],
		references: [wordTableChirho.idChirho]
	}),
	languageChirho: one(languageTableChirho, {
		fields: [machineGlossTableChirho.languageIdChirho],
		references: [languageTableChirho.idChirho]
	})
}));

export const footnoteRelationsChirho = relations(footnoteTableChirho, ({ one }) => ({
	phraseChirho: one(phraseTableChirho, {
		fields: [footnoteTableChirho.phraseIdChirho],
		references: [phraseTableChirho.idChirho]
	}),
	authorChirho: one(userTableChirho, {
		fields: [footnoteTableChirho.authorIdChirho],
		references: [userTableChirho.idChirho]
	})
}));

export const translatorNoteRelationsChirho = relations(translatorNoteTableChirho, ({ one }) => ({
	phraseChirho: one(phraseTableChirho, {
		fields: [translatorNoteTableChirho.phraseIdChirho],
		references: [phraseTableChirho.idChirho]
	}),
	authorChirho: one(userTableChirho, {
		fields: [translatorNoteTableChirho.authorIdChirho],
		references: [userTableChirho.idChirho]
	})
}));
