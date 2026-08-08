# Security Design

## Purpose

Security was considered throughout the development of Cinephile to protect user accounts, ensure data integrity, and prevent unauthorised access to application resources.

Rather than relying on a single security feature, multiple layers of protection were implemented across authentication, validation, authorisation, and configuration.

The primary security measures implemented for this project were:

- Password hashing using BCrypt
- Server-side data validation and sanitisation
- JWT authentication
- Resource ownership validation
- Secure configuration management

---

# Authentication

Cinephile uses **JSON Web Tokens (JWT)** to authenticate users.

After a successful login, the backend generates a signed JWT containing the user's identity.

The frontend stores the token and includes it in the `Authorization` header for all protected API requests.

This allows the backend to identify the currently authenticated user without maintaining server-side sessions.

Benefits include:

- Stateless authentication
- Secure communication between frontend and backend
- Standard Bearer token authentication
- Easy integration with a React single-page application

---

# Password Hashing (BCrypt)

## Why BCrypt?

Passwords should never be stored in plain text.

If a database were compromised, storing plain-text passwords would expose every user's credentials immediately.

To prevent this, Cinephile hashes every password using **BCrypt** before storing it in the database.

BCrypt was chosen because:

- It is specifically designed for password hashing.
- It automatically generates a unique salt for every password.
- It is computationally expensive, making brute-force attacks significantly more difficult.
- It is widely regarded as an industry standard for password storage.

---

## Implementation

During registration:

1. The user submits their password.
2. The password is hashed using BCrypt.
3. Only the hash is stored in the database.

The original password is never stored or retrievable.

During login:

1. The submitted password is compared against the stored BCrypt hash.
2. Authentication succeeds only if the password matches.

This ensures that sensitive credentials remain protected even if database contents are exposed.

---

# Data Validation

All user input is validated on the server before being processed.

Although the frontend performs basic validation to improve user experience, server-side validation remains the authoritative source.

This prevents malicious or invalid requests from bypassing client-side checks.

Examples include:

- Username length validation
- Email format validation
- Password strength requirements
- Rating range validation
- Required field validation
- Review length limits

Validation is implemented using ASP.NET Core model validation together with DataAnnotations on request DTOs.

If validation fails, the API automatically returns an appropriate **400 Bad Request** response without executing business logic.

---

# Data Sanitisation

In addition to validation, incoming data is normalised where appropriate before being stored.

Examples include:

- Trimming whitespace from user input.
- Treating empty review text consistently.
- Rejecting malformed request payloads.
- Ensuring values remain within expected ranges.

These measures help maintain consistent data throughout the application.

---

# Authorisation

Authentication identifies who the user is.

Authorisation determines what that user is allowed to access.

Protected endpoints require a valid JWT before access is granted.

When modifying resources such as:

- movie logs
- watchlists
- profile information

the backend verifies that the authenticated user owns the requested resource.

This prevents users from modifying another user's data simply by changing an identifier in the request.

---

# API Protection

Protected API endpoints require authentication before they can be accessed.

Public endpoints include:

- Login
- Registration
- Movie search
- Public movie information

Authenticated endpoints include:

- Watchlists
- Movie logs
- Profile information
- Achievements
- Dashboard statistics

This separation ensures that private user data remains protected.

---

# Secure Configuration

Sensitive configuration values are intentionally excluded from source control.

Examples include:

- Database connection strings
- JWT signing keys
- TMDB access token

Local development uses `appsettings.Development.json`, while production secrets are configured through Azure App Service environment variables.

This approach prevents sensitive credentials from being committed to the repository.

---

# Security During Development

Throughout development, AI was frequently used to review security-related implementation decisions.

Typical discussions included:

- Password hashing best practices
- JWT authentication
- DTO validation
- Secure API design
- Environment variable management
- Deployment configuration

Every recommendation was reviewed before implementation to ensure it aligned with the project's architecture and requirements.

---

# Future Improvements

If the project were extended further, additional security enhancements could include:

- Refresh tokens
- Email verification
- Password reset functionality
- Rate limiting for authentication endpoints
- Account lockout after repeated failed logins
- Security headers
- Content Security Policy (CSP)
- Two-factor authentication (2FA)

These features would further strengthen the application's security while remaining compatible with the existing architecture.

---

# Summary

Security was incorporated throughout Cinephile rather than being treated as a single feature.

Password hashing, server-side validation, authentication, authorisation, and secure configuration work together to protect user accounts and application data.

These measures align with modern web application security practices while remaining appropriate for the scope of the project.