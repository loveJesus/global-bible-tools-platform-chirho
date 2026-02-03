// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Standalone unit tests that don't require the full library.
//!
//! These tests verify utilities and logic without importing the Leptos views.

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use rand::Rng;
use serde::{Deserialize, Serialize};

// ============================================================================
// Password Hashing Tests
// ============================================================================

fn hash_password_chirho(password_chirho: &str) -> Result<String, String> {
    let salt_chirho = SaltString::generate(&mut OsRng);
    let argon2_chirho = Argon2::default();

    argon2_chirho
        .hash_password(password_chirho.as_bytes(), &salt_chirho)
        .map(|hash_chirho| hash_chirho.to_string())
        .map_err(|e_chirho| e_chirho.to_string())
}

fn verify_password_chirho(password_chirho: &str, hash_chirho: &str) -> bool {
    let parsed_hash_chirho = match PasswordHash::new(hash_chirho) {
        Ok(h_chirho) => h_chirho,
        Err(_) => return false,
    };

    Argon2::default()
        .verify_password(password_chirho.as_bytes(), &parsed_hash_chirho)
        .is_ok()
}

fn generate_session_token_chirho() -> String {
    let token_bytes_chirho: [u8; 32] = rand::thread_rng().gen();
    hex::encode(token_bytes_chirho)
}

#[test]
fn test_password_hash_success_chirho() {
    let password_chirho = "secure_password_123!";
    let result_chirho = hash_password_chirho(password_chirho);

    assert!(result_chirho.is_ok(), "Password hashing should succeed");

    let hash_chirho = result_chirho.unwrap();
    assert!(!hash_chirho.is_empty(), "Hash should not be empty");
    assert!(
        hash_chirho.starts_with("$argon2"),
        "Hash should be Argon2 format"
    );
}

#[test]
fn test_password_verify_correct_chirho() {
    let password_chirho = "my_secure_password";
    let hash_chirho = hash_password_chirho(password_chirho).unwrap();

    assert!(
        verify_password_chirho(password_chirho, &hash_chirho),
        "Correct password should verify"
    );
}

#[test]
fn test_password_verify_incorrect_chirho() {
    let password_chirho = "my_secure_password";
    let hash_chirho = hash_password_chirho(password_chirho).unwrap();

    assert!(
        !verify_password_chirho("wrong_password", &hash_chirho),
        "Incorrect password should not verify"
    );
}

#[test]
fn test_password_verify_invalid_hash_chirho() {
    assert!(
        !verify_password_chirho("any_password", "invalid_hash"),
        "Invalid hash should fail verification"
    );
}

#[test]
fn test_password_hash_uniqueness_chirho() {
    let password_chirho = "same_password";

    let hash1_chirho = hash_password_chirho(password_chirho).unwrap();
    let hash2_chirho = hash_password_chirho(password_chirho).unwrap();

    assert_ne!(
        hash1_chirho, hash2_chirho,
        "Same password should produce different hashes"
    );

    assert!(verify_password_chirho(password_chirho, &hash1_chirho));
    assert!(verify_password_chirho(password_chirho, &hash2_chirho));
}

#[test]
fn test_password_unicode_chirho() {
    let password_chirho = "пароль密码🔐";
    let hash_chirho = hash_password_chirho(password_chirho).unwrap();

    assert!(
        verify_password_chirho(password_chirho, &hash_chirho),
        "Unicode password should verify"
    );
}

#[test]
fn test_session_token_length_chirho() {
    let token_chirho = generate_session_token_chirho();
    assert_eq!(token_chirho.len(), 64, "Token should be 64 hex characters");
}

#[test]
fn test_session_token_uniqueness_chirho() {
    let token1_chirho = generate_session_token_chirho();
    let token2_chirho = generate_session_token_chirho();

    assert_ne!(token1_chirho, token2_chirho, "Tokens should be unique");
}

#[test]
fn test_session_token_hex_format_chirho() {
    let token_chirho = generate_session_token_chirho();

    assert!(
        token_chirho.chars().all(|c_chirho| c_chirho.is_ascii_hexdigit()),
        "Token should contain only hex characters"
    );
}

// ============================================================================
// Enum Tests
// ============================================================================

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

#[test]
fn test_role_display_chirho() {
    assert_eq!(RoleChirho::Viewer.to_string(), "viewer");
    assert_eq!(RoleChirho::Translator.to_string(), "translator");
    assert_eq!(RoleChirho::Admin.to_string(), "admin");
}

#[test]
fn test_role_serialize_chirho() {
    let viewer_chirho = RoleChirho::Viewer;
    let json_chirho = serde_json::to_string(&viewer_chirho).unwrap();
    assert_eq!(json_chirho, "\"viewer\"");
}

#[test]
fn test_role_deserialize_chirho() {
    let viewer_chirho: RoleChirho = serde_json::from_str("\"viewer\"").unwrap();
    assert_eq!(viewer_chirho, RoleChirho::Viewer);
}

#[test]
fn test_feedback_status_display_chirho() {
    assert_eq!(FeedbackStatusChirho::New.to_string(), "new");
    assert_eq!(FeedbackStatusChirho::Reviewed.to_string(), "reviewed");
    assert_eq!(FeedbackStatusChirho::Resolved.to_string(), "resolved");
}

#[test]
fn test_enum_equality_chirho() {
    assert_eq!(RoleChirho::Admin, RoleChirho::Admin);
    assert_ne!(RoleChirho::Admin, RoleChirho::Viewer);
}

// ============================================================================
// Validation Tests
// ============================================================================

fn validate_email_chirho(email_chirho: &str) -> bool {
    let at_pos_chirho = email_chirho.find('@');
    let dot_pos_chirho = email_chirho.rfind('.');

    match (at_pos_chirho, dot_pos_chirho) {
        (Some(at_chirho), Some(dot_chirho)) => {
            at_chirho > 0 && dot_chirho > at_chirho + 1 && dot_chirho < email_chirho.len() - 1
        }
        _ => false,
    }
}

fn validate_password_strength_chirho(password_chirho: &str) -> Result<(), Vec<&'static str>> {
    let mut errors_chirho = Vec::new();

    if password_chirho.len() < 8 {
        errors_chirho.push("Password must be at least 8 characters");
    }

    if !password_chirho.chars().any(|c_chirho| c_chirho.is_uppercase()) {
        errors_chirho.push("Password must contain uppercase letter");
    }

    if !password_chirho.chars().any(|c_chirho| c_chirho.is_lowercase()) {
        errors_chirho.push("Password must contain lowercase letter");
    }

    if !password_chirho.chars().any(|c_chirho| c_chirho.is_numeric()) {
        errors_chirho.push("Password must contain number");
    }

    if errors_chirho.is_empty() {
        Ok(())
    } else {
        Err(errors_chirho)
    }
}

#[test]
fn test_valid_emails_chirho() {
    assert!(validate_email_chirho("user@example.com"));
    assert!(validate_email_chirho("test.user@example-chirho.org"));
    assert!(validate_email_chirho("a@b.co"));
}

#[test]
fn test_invalid_emails_chirho() {
    assert!(!validate_email_chirho(""));
    assert!(!validate_email_chirho("@example.com"));
    assert!(!validate_email_chirho("user@"));
    assert!(!validate_email_chirho("userexample.com"));
}

#[test]
fn test_valid_passwords_chirho() {
    assert!(validate_password_strength_chirho("Password1").is_ok());
    assert!(validate_password_strength_chirho("SecurePass123!").is_ok());
}

#[test]
fn test_short_password_chirho() {
    let result_chirho = validate_password_strength_chirho("Pass1");
    assert!(result_chirho.is_err());
}

#[test]
fn test_password_no_uppercase_chirho() {
    let result_chirho = validate_password_strength_chirho("password123");
    assert!(result_chirho.is_err());
}

// ============================================================================
// Utility Tests
// ============================================================================

fn truncate_with_ellipsis_chirho(s_chirho: &str, max_len_chirho: usize) -> String {
    if s_chirho.len() <= max_len_chirho {
        s_chirho.to_string()
    } else if max_len_chirho <= 3 {
        "...".to_string()
    } else {
        format!("{}...", &s_chirho[..max_len_chirho - 3])
    }
}

fn slugify_chirho(s_chirho: &str) -> String {
    s_chirho
        .to_lowercase()
        .chars()
        .map(|c_chirho| {
            if c_chirho.is_alphanumeric() {
                c_chirho
            } else {
                '-'
            }
        })
        .collect::<String>()
        .split('-')
        .filter(|s_chirho| !s_chirho.is_empty())
        .collect::<Vec<_>>()
        .join("-")
}

#[test]
fn test_truncate_short_string_chirho() {
    let result_chirho = truncate_with_ellipsis_chirho("Hello", 10);
    assert_eq!(result_chirho, "Hello");
}

#[test]
fn test_truncate_long_string_chirho() {
    let result_chirho = truncate_with_ellipsis_chirho("Hello World!", 8);
    assert_eq!(result_chirho, "Hello...");
}

#[test]
fn test_slugify_basic_chirho() {
    assert_eq!(slugify_chirho("Hello World"), "hello-world");
}

#[test]
fn test_slugify_special_chars_chirho() {
    assert_eq!(slugify_chirho("Hello, World!"), "hello-world");
}
