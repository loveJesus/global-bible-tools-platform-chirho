// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

//! Authentication utilities.

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use thiserror::Error;

/// Authentication errors.
#[derive(Debug, Error)]
pub enum AuthErrorChirho {
    #[error("Invalid credentials")]
    InvalidCredentialsChirho,

    #[error("User not found")]
    UserNotFoundChirho,

    #[error("Password hashing failed: {0}")]
    HashErrorChirho(String),

    #[error("Session expired")]
    SessionExpiredChirho,

    #[error("Unauthorized")]
    UnauthorizedChirho,
}

/// Hash a password using Argon2.
///
/// # Arguments
///
/// * `password_chirho` - Plain text password to hash
///
/// # Returns
///
/// * `Result<String, AuthErrorChirho>` - Hashed password or error
pub fn hash_password_chirho(password_chirho: &str) -> Result<String, AuthErrorChirho> {
    let salt_chirho = SaltString::generate(&mut OsRng);
    let argon2_chirho = Argon2::default();

    argon2_chirho
        .hash_password(password_chirho.as_bytes(), &salt_chirho)
        .map(|hash_chirho| hash_chirho.to_string())
        .map_err(|e_chirho| AuthErrorChirho::HashErrorChirho(e_chirho.to_string()))
}

/// Verify a password against a hash.
///
/// # Arguments
///
/// * `password_chirho` - Plain text password to verify
/// * `hash_chirho` - Stored password hash
///
/// # Returns
///
/// * `bool` - True if password matches
pub fn verify_password_chirho(password_chirho: &str, hash_chirho: &str) -> bool {
    let parsed_hash_chirho = match PasswordHash::new(hash_chirho) {
        Ok(h_chirho) => h_chirho,
        Err(_) => return false,
    };

    Argon2::default()
        .verify_password(password_chirho.as_bytes(), &parsed_hash_chirho)
        .is_ok()
}

/// Generate a secure random session token.
pub fn generate_session_token_chirho() -> String {
    use rand::Rng;
    let token_bytes_chirho: [u8; 32] = rand::thread_rng().gen();
    hex::encode(token_bytes_chirho)
}

#[cfg(test)]
mod tests_chirho {
    use super::*;

    #[test]
    fn test_password_hash_and_verify_chirho() {
        let password_chirho = "secure_password_123";
        let hash_chirho = hash_password_chirho(password_chirho).unwrap();

        assert!(verify_password_chirho(password_chirho, &hash_chirho));
        assert!(!verify_password_chirho("wrong_password", &hash_chirho));
    }

    #[test]
    fn test_session_token_generation_chirho() {
        let token1_chirho = generate_session_token_chirho();
        let token2_chirho = generate_session_token_chirho();

        assert_eq!(token1_chirho.len(), 64); // 32 bytes = 64 hex chars
        assert_ne!(token1_chirho, token2_chirho);
    }
}
