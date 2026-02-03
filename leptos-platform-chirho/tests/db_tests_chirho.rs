// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Database integration tests.
//!
//! These tests require a running PostgreSQL database.
//! Start the database: `docker compose up db-chirho -d`

use chrono::Utc;
use once_cell::sync::Lazy;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::sync::Arc;
use tokio::sync::Mutex;
use uuid::Uuid;

/// Test database connection string.
/// Uses the SvelteKit database (port 5435) which has all the schema.
const TEST_DATABASE_URL_CHIRHO: &str =
    "postgresql://postgres:asdfasdf@localhost:5435/postgres";

/// Shared test database pool.
static TEST_POOL_CHIRHO: Lazy<Arc<Mutex<Option<PgPool>>>> =
    Lazy::new(|| Arc::new(Mutex::new(None)));

/// Get or create the test database pool.
async fn get_test_pool_chirho() -> PgPool {
    let mut pool_guard_chirho = TEST_POOL_CHIRHO.lock().await;

    if let Some(pool_chirho) = pool_guard_chirho.as_ref() {
        return pool_chirho.clone();
    }

    let pool_chirho = PgPoolOptions::new()
        .max_connections(5)
        .connect(TEST_DATABASE_URL_CHIRHO)
        .await
        .expect("Failed to connect to test database");

    setup_test_schema_chirho(&pool_chirho).await;

    *pool_guard_chirho = Some(pool_chirho.clone());
    pool_chirho
}

/// Set up the test database schema.
async fn setup_test_schema_chirho(pool_chirho: &PgPool) {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT NOT NULL UNIQUE,
            name TEXT,
            hashed_password TEXT NOT NULL,
            profile_picture_chirho TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool_chirho)
    .await
    .expect("Failed to create users table");

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS sessions_chirho (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool_chirho)
    .await
    .expect("Failed to create sessions_chirho table");

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS feedback_chirho (
            id_chirho SERIAL PRIMARY KEY,
            user_id_chirho UUID,
            email_chirho TEXT,
            category_chirho TEXT NOT NULL,
            message_chirho TEXT NOT NULL,
            page_url_chirho TEXT,
            status_chirho TEXT NOT NULL DEFAULT 'new',
            ai_sentiment_chirho TEXT,
            admin_reply_chirho TEXT,
            created_at_chirho TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at_chirho TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        "#,
    )
    .execute(pool_chirho)
    .await
    .expect("Failed to create feedback_chirho table");
}

async fn cleanup_test_user_chirho(pool_chirho: &PgPool, email_chirho: &str) {
    sqlx::query("DELETE FROM users WHERE email = $1")
        .bind(email_chirho)
        .execute(pool_chirho)
        .await
        .ok();
}

fn test_email_chirho() -> String {
    format!("test-{}@example-chirho.com", Uuid::new_v4())
}

// ============================================================================
// User Tests
// ============================================================================

#[tokio::test]
async fn test_create_user_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = test_email_chirho();

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    let result_chirho = sqlx::query_as::<_, (Uuid, String, Option<String>)>(
        r#"
        INSERT INTO users (email, name, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING id, email, name
        "#,
    )
    .bind(&email_chirho)
    .bind("Test User Chirho")
    .bind("hashed_password_placeholder")
    .fetch_one(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok(), "Failed to create user");

    let (id_chirho, returned_email_chirho, name_chirho) = result_chirho.unwrap();
    assert!(!id_chirho.is_nil());
    assert_eq!(returned_email_chirho, email_chirho);
    assert_eq!(name_chirho.as_deref(), Some("Test User Chirho"));

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

#[tokio::test]
async fn test_find_user_by_email_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = test_email_chirho();

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    sqlx::query("INSERT INTO users (email, name, hashed_password) VALUES ($1, $2, $3)")
        .bind(&email_chirho)
        .bind("Find Test Chirho")
        .bind("hashed_password")
        .execute(&pool_chirho)
        .await
        .expect("Failed to create test user");

    let result_chirho = sqlx::query_as::<_, (Uuid, String, Option<String>)>(
        "SELECT id, email, name FROM users WHERE email = $1",
    )
    .bind(&email_chirho)
    .fetch_optional(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok());
    let user_chirho = result_chirho.unwrap();
    assert!(user_chirho.is_some());

    let (_, returned_email_chirho, name_chirho) = user_chirho.unwrap();
    assert_eq!(returned_email_chirho, email_chirho);
    assert_eq!(name_chirho.as_deref(), Some("Find Test Chirho"));

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

#[tokio::test]
async fn test_user_not_found_chirho() {
    let pool_chirho = get_test_pool_chirho().await;

    let result_chirho = sqlx::query_as::<_, (Uuid,)>(
        "SELECT id FROM users WHERE email = $1",
    )
    .bind("nonexistent@example-chirho.com")
    .fetch_optional(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok());
    assert!(result_chirho.unwrap().is_none());
}

#[tokio::test]
async fn test_duplicate_email_fails_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = test_email_chirho();

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    sqlx::query("INSERT INTO users (email, name, hashed_password) VALUES ($1, $2, $3)")
        .bind(&email_chirho)
        .bind("First User Chirho")
        .bind("hashed_password")
        .execute(&pool_chirho)
        .await
        .expect("Failed to create first user");

    let result_chirho = sqlx::query(
        "INSERT INTO users (email, name, hashed_password) VALUES ($1, $2, $3)",
    )
    .bind(&email_chirho)
    .bind("Duplicate User Chirho")
    .bind("hashed_password")
    .execute(&pool_chirho)
    .await;

    assert!(result_chirho.is_err(), "Duplicate email should fail");

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

// ============================================================================
// Session Tests
// ============================================================================

#[tokio::test]
async fn test_create_session_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = format!("session-test-{}@example-chirho.com", Uuid::new_v4());

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    let user_id_chirho: Uuid = sqlx::query_scalar(
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id",
    )
    .bind(&email_chirho)
    .bind("hashed_password")
    .fetch_one(&pool_chirho)
    .await
    .expect("Failed to create user");

    let token_chirho = format!("test_token_{}", Uuid::new_v4());
    let expires_at_chirho = Utc::now() + chrono::Duration::hours(24);

    let result_chirho = sqlx::query_as::<_, (Uuid, String)>(
        r#"
        INSERT INTO sessions_chirho (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id, token
        "#,
    )
    .bind(user_id_chirho)
    .bind(&token_chirho)
    .bind(expires_at_chirho)
    .fetch_one(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok(), "Failed to create session");

    let (session_id_chirho, returned_token_chirho) = result_chirho.unwrap();
    assert!(!session_id_chirho.is_nil());
    assert_eq!(returned_token_chirho, token_chirho);

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

#[tokio::test]
async fn test_find_valid_session_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = format!("valid-session-{}@example-chirho.com", Uuid::new_v4());

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    let user_id_chirho: Uuid = sqlx::query_scalar(
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id",
    )
    .bind(&email_chirho)
    .bind("hashed_password")
    .fetch_one(&pool_chirho)
    .await
    .expect("Failed to create user");

    let token_chirho = format!("valid_token_{}", Uuid::new_v4());
    let expires_at_chirho = Utc::now() + chrono::Duration::hours(24);

    sqlx::query("INSERT INTO sessions_chirho (user_id, token, expires_at) VALUES ($1, $2, $3)")
        .bind(user_id_chirho)
        .bind(&token_chirho)
        .bind(expires_at_chirho)
        .execute(&pool_chirho)
        .await
        .expect("Failed to create session");

    let result_chirho = sqlx::query_as::<_, (Uuid, Uuid)>(
        "SELECT id, user_id FROM sessions_chirho WHERE token = $1 AND expires_at > NOW()",
    )
    .bind(&token_chirho)
    .fetch_optional(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok());
    let session_chirho = result_chirho.unwrap();
    assert!(session_chirho.is_some());

    let (_, found_user_id_chirho) = session_chirho.unwrap();
    assert_eq!(found_user_id_chirho, user_id_chirho);

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

#[tokio::test]
async fn test_expired_session_not_found_chirho() {
    let pool_chirho = get_test_pool_chirho().await;
    let email_chirho = format!("expired-session-{}@example-chirho.com", Uuid::new_v4());

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;

    let user_id_chirho: Uuid = sqlx::query_scalar(
        "INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING id",
    )
    .bind(&email_chirho)
    .bind("hashed_password")
    .fetch_one(&pool_chirho)
    .await
    .expect("Failed to create user");

    let token_chirho = format!("expired_token_{}", Uuid::new_v4());
    let expires_at_chirho = Utc::now() - chrono::Duration::hours(1);

    sqlx::query("INSERT INTO sessions_chirho (user_id, token, expires_at) VALUES ($1, $2, $3)")
        .bind(user_id_chirho)
        .bind(&token_chirho)
        .bind(expires_at_chirho)
        .execute(&pool_chirho)
        .await
        .expect("Failed to create session");

    let result_chirho = sqlx::query_as::<_, (Uuid,)>(
        "SELECT id FROM sessions_chirho WHERE token = $1 AND expires_at > NOW()",
    )
    .bind(&token_chirho)
    .fetch_optional(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok());
    assert!(result_chirho.unwrap().is_none(), "Expired session should not be found");

    cleanup_test_user_chirho(&pool_chirho, &email_chirho).await;
}

// ============================================================================
// Feedback Tests
// ============================================================================

#[tokio::test]
async fn test_create_feedback_chirho() {
    let pool_chirho = get_test_pool_chirho().await;

    let result_chirho = sqlx::query_as::<_, (i32, String, String)>(
        r#"
        INSERT INTO feedback_chirho (category_chirho, message_chirho, email_chirho)
        VALUES ($1, $2, $3)
        RETURNING id_chirho, category_chirho, message_chirho
        "#,
    )
    .bind("bug")
    .bind("Test bug report chirho")
    .bind("tester@example-chirho.com")
    .fetch_one(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok(), "Failed to create feedback");

    let (id_chirho, category_chirho, message_chirho) = result_chirho.unwrap();
    assert!(id_chirho > 0);
    assert_eq!(category_chirho, "bug");
    assert_eq!(message_chirho, "Test bug report chirho");

    sqlx::query("DELETE FROM feedback_chirho WHERE id_chirho = $1")
        .bind(id_chirho)
        .execute(&pool_chirho)
        .await
        .ok();
}

#[tokio::test]
async fn test_update_feedback_status_chirho() {
    let pool_chirho = get_test_pool_chirho().await;

    let id_chirho: i32 = sqlx::query_scalar(
        "INSERT INTO feedback_chirho (category_chirho, message_chirho) VALUES ('suggestion', 'Test') RETURNING id_chirho",
    )
    .fetch_one(&pool_chirho)
    .await
    .expect("Failed to create feedback");

    let result_chirho = sqlx::query_as::<_, (String,)>(
        "UPDATE feedback_chirho SET status_chirho = $2 WHERE id_chirho = $1 RETURNING status_chirho",
    )
    .bind(id_chirho)
    .bind("reviewed")
    .fetch_one(&pool_chirho)
    .await;

    assert!(result_chirho.is_ok());
    let (status_chirho,) = result_chirho.unwrap();
    assert_eq!(status_chirho, "reviewed");

    sqlx::query("DELETE FROM feedback_chirho WHERE id_chirho = $1")
        .bind(id_chirho)
        .execute(&pool_chirho)
        .await
        .ok();
}
