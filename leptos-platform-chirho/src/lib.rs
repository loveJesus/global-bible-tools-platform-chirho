// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

#![recursion_limit = "1024"]

//! # Leptos Platform Chirho
//!
//! Bible translation platform built with Leptos, SQLx, and Tailwind CSS.
//!
//! ## Architecture
//!
//! - `app_chirho` - Main application component and routing
//! - `routes_chirho` - Page components for each route
//! - `components_chirho` - Reusable UI components
//! - `server_chirho` - Server functions (database, auth, etc.)
//! - `db_chirho` - Database models and queries (SQLx)

pub mod app_chirho;
pub mod components_chirho;
pub mod routes_chirho;

#[cfg(feature = "ssr")]
pub mod db_chirho;

#[cfg(feature = "ssr")]
pub mod server_chirho;

#[cfg(feature = "hydrate")]
#[wasm_bindgen::prelude::wasm_bindgen]
pub fn hydrate_chirho() {
    use crate::app_chirho::AppChirho;
    console_error_panic_hook::set_once();
    leptos::mount::hydrate_body(AppChirho);
}
