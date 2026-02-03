// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Database models with SQLx integration.

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

/// User account model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserChirho {
    pub id_chirho: Uuid,
    pub email_chirho: String,
    pub name_chirho: Option<String>,
    pub hashed_password_chirho: String,
    pub profile_picture_chirho: Option<String>,
    pub created_at_chirho: DateTime<Utc>,
    pub updated_at_chirho: DateTime<Utc>,
}

/// User session model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct SessionChirho {
    pub id_chirho: Uuid,
    pub user_id_chirho: Uuid,
    pub token_chirho: String,
    pub expires_at_chirho: DateTime<Utc>,
    pub created_at_chirho: DateTime<Utc>,
}

/// Translation language model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct LanguageChirho {
    pub code_chirho: String,
    pub name_chirho: String,
    pub font_chirho: Option<String>,
    pub text_direction_chirho: String,
    pub created_at_chirho: DateTime<Utc>,
    pub updated_at_chirho: DateTime<Utc>,
}

/// Language member role model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct LanguageMemberRoleChirho {
    pub user_id_chirho: Uuid,
    pub language_code_chirho: String,
    pub role_chirho: String,
    pub created_at_chirho: DateTime<Utc>,
}

/// User feedback model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedbackChirho {
    pub id_chirho: i32,
    pub user_id_chirho: Option<Uuid>,
    pub email_chirho: Option<String>,
    pub category_chirho: String,
    pub message_chirho: String,
    pub page_url_chirho: Option<String>,
    pub status_chirho: String,
    pub ai_sentiment_chirho: Option<String>,
    pub admin_reply_chirho: Option<String>,
    pub created_at_chirho: DateTime<Utc>,
    pub updated_at_chirho: DateTime<Utc>,
}

/// Bible book model (read-only reference).
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct BookChirho {
    pub id_chirho: i32,
    pub name_chirho: String,
    pub chapters_chirho: i32,
}

/// Bible verse model (read-only reference).
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct VerseChirho {
    pub id_chirho: String,
    pub book_id_chirho: i32,
    pub chapter_chirho: i32,
    pub verse_chirho: i32,
}

/// Bible word model (read-only reference).
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct WordChirho {
    pub id_chirho: String,
    pub verse_id_chirho: String,
    pub text_chirho: String,
    pub lemma_id_chirho: Option<String>,
    pub grammar_chirho: Option<String>,
}

/// Lemma (dictionary form) model (read-only reference).
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct LemmaChirho {
    pub id_chirho: String,
    pub lemma_chirho: String,
    pub strongs_chirho: Option<String>,
}

/// Gloss (translation) model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct GlossChirho {
    pub word_id_chirho: String,
    pub language_code_chirho: String,
    pub gloss_chirho: String,
    pub state_chirho: String,
    pub source_chirho: Option<String>,
    pub user_id_chirho: Option<Uuid>,
    pub created_at_chirho: DateTime<Utc>,
    pub updated_at_chirho: DateTime<Utc>,
}

/// Phrase (multi-word translation unit) model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PhraseChirho {
    pub id_chirho: Uuid,
    pub language_code_chirho: String,
    pub created_at_chirho: DateTime<Utc>,
}

/// Import job model.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ImportJobChirho {
    pub id_chirho: Uuid,
    pub language_code_chirho: String,
    pub user_id_chirho: Option<Uuid>,
    pub status_chirho: String,
    pub started_at_chirho: DateTime<Utc>,
    pub completed_at_chirho: Option<DateTime<Utc>>,
    pub error_message_chirho: Option<String>,
}

// Enums for type safety

/// User role in a language team.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RoleChirho {
    Viewer,
    Translator,
    Admin,
}

impl std::fmt::Display for RoleChirho {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            RoleChirho::Viewer => write!(f, "viewer"),
            RoleChirho::Translator => write!(f, "translator"),
            RoleChirho::Admin => write!(f, "admin"),
        }
    }
}

/// Gloss state (translation status).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum GlossStateChirho {
    Approved,
    Unapproved,
}

impl std::fmt::Display for GlossStateChirho {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            GlossStateChirho::Approved => write!(f, "approved"),
            GlossStateChirho::Unapproved => write!(f, "unapproved"),
        }
    }
}

/// Feedback category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FeedbackCategoryChirho {
    Bug,
    Suggestion,
    Praise,
}

impl std::fmt::Display for FeedbackCategoryChirho {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            FeedbackCategoryChirho::Bug => write!(f, "bug"),
            FeedbackCategoryChirho::Suggestion => write!(f, "suggestion"),
            FeedbackCategoryChirho::Praise => write!(f, "praise"),
        }
    }
}

/// Feedback status.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FeedbackStatusChirho {
    New,
    Reviewed,
    Resolved,
}

impl std::fmt::Display for FeedbackStatusChirho {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            FeedbackStatusChirho::New => write!(f, "new"),
            FeedbackStatusChirho::Reviewed => write!(f, "reviewed"),
            FeedbackStatusChirho::Resolved => write!(f, "resolved"),
        }
    }
}
