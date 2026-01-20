// For God so loved the world, that He gave His only begotten Son,
// that all who believe in Him should not perish but have everlasting life.
// — John 3:16

import { env as envChirho } from '$env/dynamic/private';

interface EmailOptionsChirho {
	toChirho: string;
	subjectChirho: string;
	htmlChirho: string;
	textChirho?: string;
}

interface TwoSmtpResponseChirho {
	successChirho: boolean;
	messageIdChirho?: string;
	errorChirho?: string;
}

/**
 * Send email using 2SMTP API
 * @see https://2smtp.com/docs
 */
export async function sendEmailChirho(optionsChirho: EmailOptionsChirho): Promise<TwoSmtpResponseChirho> {
	const apiKeyChirho = envChirho.TWOSMTP_API_KEY_CHIRHO;
	const fromEmailChirho = envChirho.TWOSMTP_FROM_EMAIL_CHIRHO || 'noreply@global.bible.systems';

	if (!apiKeyChirho) {
		console.warn('[email-chirho] 2SMTP API key not configured, skipping email send');
		// In development, log the email instead
		console.log('[email-chirho] Would send email:', {
			toChirho: optionsChirho.toChirho,
			subjectChirho: optionsChirho.subjectChirho,
			htmlChirho: optionsChirho.htmlChirho.substring(0, 200) + '...'
		});
		return { successChirho: true, messageIdChirho: 'dev-mode-no-send' };
	}

	try {
		const responseChirho = await fetch('https://api.2smtp.com/v1/email/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKeyChirho}`
			},
			body: JSON.stringify({
				from: fromEmailChirho,
				to: optionsChirho.toChirho,
				subject: optionsChirho.subjectChirho,
				html: optionsChirho.htmlChirho,
				text: optionsChirho.textChirho || stripHtmlChirho(optionsChirho.htmlChirho)
			})
		});

		if (!responseChirho.ok) {
			const errorTextChirho = await responseChirho.text();
			console.error('[email-chirho] 2SMTP API error:', responseChirho.status, errorTextChirho);
			return { successChirho: false, errorChirho: `API error: ${responseChirho.status}` };
		}

		const dataChirho = await responseChirho.json() as { message_id?: string };
		return { successChirho: true, messageIdChirho: dataChirho.message_id };
	} catch (errorChirho) {
		console.error('[email-chirho] Failed to send email:', errorChirho);
		return { successChirho: false, errorChirho: String(errorChirho) };
	}
}

function stripHtmlChirho(htmlChirho: string): string {
	return htmlChirho.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Email templates
export function verificationEmailChirho(
	nameChirho: string,
	verificationLinkChirho: string
): { subjectChirho: string; htmlChirho: string } {
	return {
		subjectChirho: 'Verify your email - Global Bible Tools',
		htmlChirho: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
					.content { padding: 30px 0; }
					.button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
					.footer { padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1 style="color: #1e293b; margin: 0;">Global Bible Tools</h1>
					</div>
					<div class="content">
						<p>Hello${nameChirho ? ` ${nameChirho}` : ''},</p>
						<p>Thank you for registering with Global Bible Tools. Please verify your email address by clicking the button below:</p>
						<p style="text-align: center; padding: 20px 0;">
							<a href="${verificationLinkChirho}" class="button">Verify Email</a>
						</p>
						<p>Or copy and paste this link into your browser:</p>
						<p style="word-break: break-all; color: #2563eb;">${verificationLinkChirho}</p>
						<p>This link will expire in 24 hours.</p>
						<p>If you didn't create an account, you can safely ignore this email.</p>
					</div>
					<div class="footer">
						<p>This email was sent by Global Bible Tools. Do not reply to this email.</p>
					</div>
				</div>
			</body>
			</html>
		`
	};
}

export function passwordResetEmailChirho(
	nameChirho: string,
	resetLinkChirho: string
): { subjectChirho: string; htmlChirho: string } {
	return {
		subjectChirho: 'Reset your password - Global Bible Tools',
		htmlChirho: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
					.content { padding: 30px 0; }
					.button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
					.footer { padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1 style="color: #1e293b; margin: 0;">Global Bible Tools</h1>
					</div>
					<div class="content">
						<p>Hello${nameChirho ? ` ${nameChirho}` : ''},</p>
						<p>We received a request to reset your password. Click the button below to create a new password:</p>
						<p style="text-align: center; padding: 20px 0;">
							<a href="${resetLinkChirho}" class="button">Reset Password</a>
						</p>
						<p>Or copy and paste this link into your browser:</p>
						<p style="word-break: break-all; color: #2563eb;">${resetLinkChirho}</p>
						<p>This link will expire in 1 hour.</p>
						<p>If you didn't request a password reset, you can safely ignore this email.</p>
					</div>
					<div class="footer">
						<p>This email was sent by Global Bible Tools. Do not reply to this email.</p>
					</div>
				</div>
			</body>
			</html>
		`
	};
}

export function invitationEmailChirho(
	inviteLinkChirho: string
): { subjectChirho: string; htmlChirho: string } {
	return {
		subjectChirho: 'You\'ve been invited to Global Bible Tools',
		htmlChirho: `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<style>
					body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { text-align: center; padding: 20px 0; border-bottom: 1px solid #e2e8f0; }
					.content { padding: 30px 0; }
					.button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
					.footer { padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1 style="color: #1e293b; margin: 0;">Global Bible Tools</h1>
					</div>
					<div class="content">
						<p>Hello,</p>
						<p>You've been invited to join Global Bible Tools, a platform for collaborative Bible translation.</p>
						<p>Click the button below to accept your invitation and create your account:</p>
						<p style="text-align: center; padding: 20px 0;">
							<a href="${inviteLinkChirho}" class="button">Accept Invitation</a>
						</p>
						<p>Or copy and paste this link into your browser:</p>
						<p style="word-break: break-all; color: #2563eb;">${inviteLinkChirho}</p>
						<p>This invitation will expire in 7 days.</p>
					</div>
					<div class="footer">
						<p>This email was sent by Global Bible Tools. Do not reply to this email.</p>
					</div>
				</div>
			</body>
			</html>
		`
	};
}
