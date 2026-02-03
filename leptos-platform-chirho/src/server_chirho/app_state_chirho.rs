// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Application state for Axum/Leptos integration.

use crate::db_chirho::DbPoolChirho;
use axum::extract::FromRef;
use leptos::prelude::LeptosOptions;

/// Application state shared across all requests.
#[derive(Clone)]
pub struct AppStateChirho {
    /// Database connection pool.
    pub pool_chirho: DbPoolChirho,
    /// Leptos configuration options.
    pub leptos_options_chirho: LeptosOptions,
}

impl AppStateChirho {
    /// Create a new application state.
    pub fn new_chirho(pool_chirho: DbPoolChirho, leptos_options_chirho: LeptosOptions) -> Self {
        Self {
            pool_chirho,
            leptos_options_chirho,
        }
    }
}

// Implement FromRef to extract pool from state
impl FromRef<AppStateChirho> for DbPoolChirho {
    fn from_ref(state_chirho: &AppStateChirho) -> Self {
        state_chirho.pool_chirho.clone()
    }
}

// Implement FromRef for LeptosOptions (required by leptos_axum)
impl FromRef<AppStateChirho> for LeptosOptions {
    fn from_ref(state_chirho: &AppStateChirho) -> Self {
        state_chirho.leptos_options_chirho.clone()
    }
}
