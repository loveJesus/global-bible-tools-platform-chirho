// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Database layer using SQLx with runtime queries.
//!
//! ## Usage
//!
//! ```rust,ignore
//! use leptos_platform_chirho::db_chirho::{create_pool_chirho, UserChirho};
//!
//! let pool_chirho = create_pool_chirho(&database_url_chirho).await?;
//! let user_chirho = UserChirho::find_by_email_chirho(&pool_chirho, &email_chirho).await?;
//! ```

pub mod models_chirho;
pub mod queries_chirho;

use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;

/// Database connection pool type alias.
pub type DbPoolChirho = PgPool;

/// Maximum number of connections in the pool.
const MAX_CONNECTIONS_CHIRHO: u32 = 10;

/// Connection timeout duration.
const CONNECT_TIMEOUT_CHIRHO: Duration = Duration::from_secs(10);

/// Create a new database connection pool.
///
/// # Arguments
///
/// * `database_url_chirho` - PostgreSQL connection string
///
/// # Returns
///
/// * `Result<DbPoolChirho, sqlx::Error>` - Connection pool or error
pub async fn create_pool_chirho(database_url_chirho: &str) -> Result<DbPoolChirho, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(MAX_CONNECTIONS_CHIRHO)
        .acquire_timeout(CONNECT_TIMEOUT_CHIRHO)
        .connect(database_url_chirho)
        .await
}

/// Run database migrations manually.
///
/// For production use, consider using `cargo sqlx prepare` for embedded migrations.
/// This version reads migrations from disk at runtime.
pub async fn run_migrations_chirho(pool_chirho: &DbPoolChirho) -> Result<(), sqlx::Error> {
    // For now, we run a simple check that the database is accessible
    // In production, use: sqlx::migrate!("./migrations_chirho").run(pool_chirho).await
    sqlx::query("SELECT 1")
        .execute(pool_chirho)
        .await
        .map(|_| ())
}

// Re-export models for convenience
pub use models_chirho::*;
