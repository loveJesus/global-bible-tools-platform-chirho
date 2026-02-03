// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Leptos server functions for client-server communication.
//!
//! Server functions are automatically exposed as API endpoints and can be
//! called from client-side code with type safety.

use leptos::prelude::*;
use serde::{Deserialize, Serialize};

// ============================================================================
// Authentication Server Functions
// ============================================================================

/// Login request data.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginRequestChirho {
    pub email_chirho: String,
    pub password_chirho: String,
}

/// Login response data.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LoginResponseChirho {
    pub success_chirho: bool,
    pub message_chirho: String,
}

/// Server function for user login.
#[server(LoginChirho, "/api-chirho")]
pub async fn login_chirho(
    email_chirho: String,
    password_chirho: String,
) -> Result<LoginResponseChirho, ServerFnError> {
    use crate::db_chirho::{queries_chirho, DbPoolChirho};
    use crate::server_chirho::auth_chirho::verify_password_chirho;

    let pool_chirho = use_context::<DbPoolChirho>()
        .ok_or_else(|| ServerFnError::new("Database pool not found"))?;

    // Find user by email
    let user_chirho = queries_chirho::find_user_by_email_chirho(&pool_chirho, &email_chirho)
        .await
        .map_err(|e_chirho| ServerFnError::new(format!("Database error: {}", e_chirho)))?;

    match user_chirho {
        Some(user_chirho) => {
            if verify_password_chirho(&password_chirho, &user_chirho.hashed_password_chirho) {
                // TODO: Create session and set cookie
                Ok(LoginResponseChirho {
                    success_chirho: true,
                    message_chirho: "Login successful".to_string(),
                })
            } else {
                Ok(LoginResponseChirho {
                    success_chirho: false,
                    message_chirho: "Invalid credentials".to_string(),
                })
            }
        }
        None => Ok(LoginResponseChirho {
            success_chirho: false,
            message_chirho: "User not found".to_string(),
        }),
    }
}

/// Server function for user registration.
#[server(RegisterChirho, "/api-chirho")]
pub async fn register_chirho(
    email_chirho: String,
    name_chirho: String,
    password_chirho: String,
) -> Result<LoginResponseChirho, ServerFnError> {
    use crate::db_chirho::{queries_chirho, DbPoolChirho};
    use crate::server_chirho::auth_chirho::hash_password_chirho;

    let pool_chirho = use_context::<DbPoolChirho>()
        .ok_or_else(|| ServerFnError::new("Database pool not found"))?;

    // Check if user already exists
    let existing_chirho = queries_chirho::find_user_by_email_chirho(&pool_chirho, &email_chirho)
        .await
        .map_err(|e_chirho| ServerFnError::new(format!("Database error: {}", e_chirho)))?;

    if existing_chirho.is_some() {
        return Ok(LoginResponseChirho {
            success_chirho: false,
            message_chirho: "Email already registered".to_string(),
        });
    }

    // Hash password
    let hashed_chirho = hash_password_chirho(&password_chirho)
        .map_err(|e_chirho| ServerFnError::new(format!("Password hash error: {}", e_chirho)))?;

    // Create user
    queries_chirho::create_user_chirho(&pool_chirho, &email_chirho, Some(&name_chirho), &hashed_chirho)
        .await
        .map_err(|e_chirho| ServerFnError::new(format!("Failed to create user: {}", e_chirho)))?;

    Ok(LoginResponseChirho {
        success_chirho: true,
        message_chirho: "Registration successful".to_string(),
    })
}

// ============================================================================
// Language Server Functions
// ============================================================================

/// Language data for client.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct LanguageDataChirho {
    pub code_chirho: String,
    pub name_chirho: String,
    pub text_direction_chirho: String,
}

/// Get all available languages.
#[server(GetLanguagesChirho, "/api-chirho")]
pub async fn get_languages_chirho() -> Result<Vec<LanguageDataChirho>, ServerFnError> {
    use crate::db_chirho::{queries_chirho, DbPoolChirho};

    let pool_chirho = use_context::<DbPoolChirho>()
        .ok_or_else(|| ServerFnError::new("Database pool not found"))?;

    let languages_chirho = queries_chirho::get_all_languages_chirho(&pool_chirho)
        .await
        .map_err(|e_chirho| ServerFnError::new(format!("Database error: {}", e_chirho)))?;

    Ok(languages_chirho
        .into_iter()
        .map(|lang_chirho| LanguageDataChirho {
            code_chirho: lang_chirho.code_chirho,
            name_chirho: lang_chirho.name_chirho,
            text_direction_chirho: lang_chirho.text_direction_chirho,
        })
        .collect())
}

// ============================================================================
// Feedback Server Functions
// ============================================================================

/// Feedback data for client.
#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct FeedbackDataChirho {
    pub id_chirho: i32,
    pub category_chirho: String,
    pub message_chirho: String,
    pub status_chirho: String,
    pub created_at_chirho: String,
}

/// Submit new feedback.
#[server(SubmitFeedbackChirho, "/api-chirho")]
pub async fn submit_feedback_chirho(
    category_chirho: String,
    message_chirho: String,
    page_url_chirho: Option<String>,
) -> Result<bool, ServerFnError> {
    use crate::db_chirho::{queries_chirho, DbPoolChirho};

    let pool_chirho = use_context::<DbPoolChirho>()
        .ok_or_else(|| ServerFnError::new("Database pool not found"))?;

    // TODO: Get user_id from session
    let user_id_chirho = None;
    let email_chirho: Option<&str> = None;

    queries_chirho::create_feedback_chirho(
        &pool_chirho,
        user_id_chirho,
        email_chirho,
        &category_chirho,
        &message_chirho,
        page_url_chirho.as_deref(),
    )
    .await
    .map_err(|e_chirho| ServerFnError::new(format!("Failed to submit feedback: {}", e_chirho)))?;

    Ok(true)
}
