// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Database queries using SQLx with runtime type checking.
//!
//! These queries use runtime validation for flexibility during development.
//! For production, consider using `cargo sqlx prepare` for compile-time checking.

use super::models_chirho::{FeedbackChirho, LanguageChirho, UserChirho};
use super::DbPoolChirho;
use sqlx::{Error as SqlxErrorChirho, Row};
use uuid::Uuid;

// ============================================================================
// User Queries
// ============================================================================

/// Find a user by their email address.
pub async fn find_user_by_email_chirho(
    pool_chirho: &DbPoolChirho,
    email_chirho: &str,
) -> Result<Option<UserChirho>, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        SELECT
            id,
            email,
            name,
            hashed_password,
            profile_picture_chirho,
            created_at,
            updated_at
        FROM users
        WHERE email = $1
        "#,
    )
    .bind(email_chirho)
    .fetch_optional(pool_chirho)
    .await?;

    Ok(row_chirho.map(|row_chirho| UserChirho {
        id_chirho: row_chirho.get("id"),
        email_chirho: row_chirho.get("email"),
        name_chirho: row_chirho.get("name"),
        hashed_password_chirho: row_chirho.get("hashed_password"),
        profile_picture_chirho: row_chirho.get("profile_picture_chirho"),
        created_at_chirho: row_chirho.get("created_at"),
        updated_at_chirho: row_chirho.get("updated_at"),
    }))
}

/// Find a user by their ID.
pub async fn find_user_by_id_chirho(
    pool_chirho: &DbPoolChirho,
    user_id_chirho: Uuid,
) -> Result<Option<UserChirho>, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        SELECT
            id,
            email,
            name,
            hashed_password,
            profile_picture_chirho,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        "#,
    )
    .bind(user_id_chirho)
    .fetch_optional(pool_chirho)
    .await?;

    Ok(row_chirho.map(|row_chirho| UserChirho {
        id_chirho: row_chirho.get("id"),
        email_chirho: row_chirho.get("email"),
        name_chirho: row_chirho.get("name"),
        hashed_password_chirho: row_chirho.get("hashed_password"),
        profile_picture_chirho: row_chirho.get("profile_picture_chirho"),
        created_at_chirho: row_chirho.get("created_at"),
        updated_at_chirho: row_chirho.get("updated_at"),
    }))
}

/// Create a new user.
pub async fn create_user_chirho(
    pool_chirho: &DbPoolChirho,
    email_chirho: &str,
    name_chirho: Option<&str>,
    hashed_password_chirho: &str,
) -> Result<UserChirho, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        INSERT INTO users (email, name, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING
            id,
            email,
            name,
            hashed_password,
            profile_picture_chirho,
            created_at,
            updated_at
        "#,
    )
    .bind(email_chirho)
    .bind(name_chirho)
    .bind(hashed_password_chirho)
    .fetch_one(pool_chirho)
    .await?;

    Ok(UserChirho {
        id_chirho: row_chirho.get("id"),
        email_chirho: row_chirho.get("email"),
        name_chirho: row_chirho.get("name"),
        hashed_password_chirho: row_chirho.get("hashed_password"),
        profile_picture_chirho: row_chirho.get("profile_picture_chirho"),
        created_at_chirho: row_chirho.get("created_at"),
        updated_at_chirho: row_chirho.get("updated_at"),
    })
}

/// Update user profile.
pub async fn update_user_profile_chirho(
    pool_chirho: &DbPoolChirho,
    user_id_chirho: Uuid,
    name_chirho: Option<&str>,
    profile_picture_chirho: Option<&str>,
) -> Result<UserChirho, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        UPDATE users
        SET
            name = COALESCE($2, name),
            profile_picture_chirho = COALESCE($3, profile_picture_chirho),
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            email,
            name,
            hashed_password,
            profile_picture_chirho,
            created_at,
            updated_at
        "#,
    )
    .bind(user_id_chirho)
    .bind(name_chirho)
    .bind(profile_picture_chirho)
    .fetch_one(pool_chirho)
    .await?;

    Ok(UserChirho {
        id_chirho: row_chirho.get("id"),
        email_chirho: row_chirho.get("email"),
        name_chirho: row_chirho.get("name"),
        hashed_password_chirho: row_chirho.get("hashed_password"),
        profile_picture_chirho: row_chirho.get("profile_picture_chirho"),
        created_at_chirho: row_chirho.get("created_at"),
        updated_at_chirho: row_chirho.get("updated_at"),
    })
}

// ============================================================================
// Language Queries
// ============================================================================

/// Get all languages.
pub async fn get_all_languages_chirho(
    pool_chirho: &DbPoolChirho,
) -> Result<Vec<LanguageChirho>, SqlxErrorChirho> {
    let rows_chirho = sqlx::query(
        r#"
        SELECT
            code,
            name,
            font,
            "textDirection" as text_direction,
            "createdAt" as created_at,
            "updatedAt" as updated_at
        FROM "Language"
        ORDER BY name
        "#,
    )
    .fetch_all(pool_chirho)
    .await?;

    Ok(rows_chirho
        .into_iter()
        .map(|row_chirho| LanguageChirho {
            code_chirho: row_chirho.get("code"),
            name_chirho: row_chirho.get("name"),
            font_chirho: row_chirho.get("font"),
            text_direction_chirho: row_chirho.get("text_direction"),
            created_at_chirho: row_chirho.get("created_at"),
            updated_at_chirho: row_chirho.get("updated_at"),
        })
        .collect())
}

/// Get a language by code.
pub async fn get_language_by_code_chirho(
    pool_chirho: &DbPoolChirho,
    code_chirho: &str,
) -> Result<Option<LanguageChirho>, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        SELECT
            code,
            name,
            font,
            "textDirection" as text_direction,
            "createdAt" as created_at,
            "updatedAt" as updated_at
        FROM "Language"
        WHERE code = $1
        "#,
    )
    .bind(code_chirho)
    .fetch_optional(pool_chirho)
    .await?;

    Ok(row_chirho.map(|row_chirho| LanguageChirho {
        code_chirho: row_chirho.get("code"),
        name_chirho: row_chirho.get("name"),
        font_chirho: row_chirho.get("font"),
        text_direction_chirho: row_chirho.get("text_direction"),
        created_at_chirho: row_chirho.get("created_at"),
        updated_at_chirho: row_chirho.get("updated_at"),
    }))
}

// ============================================================================
// Feedback Queries
// ============================================================================

/// Get all feedback with optional filters.
pub async fn get_all_feedback_chirho(
    pool_chirho: &DbPoolChirho,
    limit_chirho: i64,
) -> Result<Vec<FeedbackChirho>, SqlxErrorChirho> {
    let rows_chirho = sqlx::query(
        r#"
        SELECT
            id_chirho,
            user_id_chirho,
            email_chirho,
            category_chirho,
            message_chirho,
            page_url_chirho,
            status_chirho,
            ai_sentiment_chirho,
            admin_reply_chirho,
            created_at_chirho,
            updated_at_chirho
        FROM feedback_chirho
        ORDER BY created_at_chirho DESC
        LIMIT $1
        "#,
    )
    .bind(limit_chirho)
    .fetch_all(pool_chirho)
    .await?;

    Ok(rows_chirho
        .into_iter()
        .map(|row_chirho| FeedbackChirho {
            id_chirho: row_chirho.get("id_chirho"),
            user_id_chirho: row_chirho.get("user_id_chirho"),
            email_chirho: row_chirho.get("email_chirho"),
            category_chirho: row_chirho.get("category_chirho"),
            message_chirho: row_chirho.get("message_chirho"),
            page_url_chirho: row_chirho.get("page_url_chirho"),
            status_chirho: row_chirho.get("status_chirho"),
            ai_sentiment_chirho: row_chirho.get("ai_sentiment_chirho"),
            admin_reply_chirho: row_chirho.get("admin_reply_chirho"),
            created_at_chirho: row_chirho.get("created_at_chirho"),
            updated_at_chirho: row_chirho.get("updated_at_chirho"),
        })
        .collect())
}

/// Create new feedback.
pub async fn create_feedback_chirho(
    pool_chirho: &DbPoolChirho,
    user_id_chirho: Option<Uuid>,
    email_chirho: Option<&str>,
    category_chirho: &str,
    message_chirho: &str,
    page_url_chirho: Option<&str>,
) -> Result<FeedbackChirho, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        INSERT INTO feedback_chirho (user_id_chirho, email_chirho, category_chirho, message_chirho, page_url_chirho)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id_chirho,
            user_id_chirho,
            email_chirho,
            category_chirho,
            message_chirho,
            page_url_chirho,
            status_chirho,
            ai_sentiment_chirho,
            admin_reply_chirho,
            created_at_chirho,
            updated_at_chirho
        "#,
    )
    .bind(user_id_chirho)
    .bind(email_chirho)
    .bind(category_chirho)
    .bind(message_chirho)
    .bind(page_url_chirho)
    .fetch_one(pool_chirho)
    .await?;

    Ok(FeedbackChirho {
        id_chirho: row_chirho.get("id_chirho"),
        user_id_chirho: row_chirho.get("user_id_chirho"),
        email_chirho: row_chirho.get("email_chirho"),
        category_chirho: row_chirho.get("category_chirho"),
        message_chirho: row_chirho.get("message_chirho"),
        page_url_chirho: row_chirho.get("page_url_chirho"),
        status_chirho: row_chirho.get("status_chirho"),
        ai_sentiment_chirho: row_chirho.get("ai_sentiment_chirho"),
        admin_reply_chirho: row_chirho.get("admin_reply_chirho"),
        created_at_chirho: row_chirho.get("created_at_chirho"),
        updated_at_chirho: row_chirho.get("updated_at_chirho"),
    })
}

/// Update feedback status.
pub async fn update_feedback_status_chirho(
    pool_chirho: &DbPoolChirho,
    feedback_id_chirho: i32,
    status_chirho: &str,
) -> Result<FeedbackChirho, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        UPDATE feedback_chirho
        SET status_chirho = $2, updated_at_chirho = NOW()
        WHERE id_chirho = $1
        RETURNING
            id_chirho,
            user_id_chirho,
            email_chirho,
            category_chirho,
            message_chirho,
            page_url_chirho,
            status_chirho,
            ai_sentiment_chirho,
            admin_reply_chirho,
            created_at_chirho,
            updated_at_chirho
        "#,
    )
    .bind(feedback_id_chirho)
    .bind(status_chirho)
    .fetch_one(pool_chirho)
    .await?;

    Ok(FeedbackChirho {
        id_chirho: row_chirho.get("id_chirho"),
        user_id_chirho: row_chirho.get("user_id_chirho"),
        email_chirho: row_chirho.get("email_chirho"),
        category_chirho: row_chirho.get("category_chirho"),
        message_chirho: row_chirho.get("message_chirho"),
        page_url_chirho: row_chirho.get("page_url_chirho"),
        status_chirho: row_chirho.get("status_chirho"),
        ai_sentiment_chirho: row_chirho.get("ai_sentiment_chirho"),
        admin_reply_chirho: row_chirho.get("admin_reply_chirho"),
        created_at_chirho: row_chirho.get("created_at_chirho"),
        updated_at_chirho: row_chirho.get("updated_at_chirho"),
    })
}

/// Add admin reply to feedback.
pub async fn add_feedback_reply_chirho(
    pool_chirho: &DbPoolChirho,
    feedback_id_chirho: i32,
    reply_chirho: &str,
) -> Result<FeedbackChirho, SqlxErrorChirho> {
    let row_chirho = sqlx::query(
        r#"
        UPDATE feedback_chirho
        SET admin_reply_chirho = $2, status_chirho = 'reviewed', updated_at_chirho = NOW()
        WHERE id_chirho = $1
        RETURNING
            id_chirho,
            user_id_chirho,
            email_chirho,
            category_chirho,
            message_chirho,
            page_url_chirho,
            status_chirho,
            ai_sentiment_chirho,
            admin_reply_chirho,
            created_at_chirho,
            updated_at_chirho
        "#,
    )
    .bind(feedback_id_chirho)
    .bind(reply_chirho)
    .fetch_one(pool_chirho)
    .await?;

    Ok(FeedbackChirho {
        id_chirho: row_chirho.get("id_chirho"),
        user_id_chirho: row_chirho.get("user_id_chirho"),
        email_chirho: row_chirho.get("email_chirho"),
        category_chirho: row_chirho.get("category_chirho"),
        message_chirho: row_chirho.get("message_chirho"),
        page_url_chirho: row_chirho.get("page_url_chirho"),
        status_chirho: row_chirho.get("status_chirho"),
        ai_sentiment_chirho: row_chirho.get("ai_sentiment_chirho"),
        admin_reply_chirho: row_chirho.get("admin_reply_chirho"),
        created_at_chirho: row_chirho.get("updated_at_chirho"),
        updated_at_chirho: row_chirho.get("updated_at_chirho"),
    })
}
