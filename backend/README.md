# Laravel Email Service Configuration (Brevo SMTP)

This document provides instructions for configuring email services in a Laravel backend using Brevo SMTP.

## Prerequisites
- A Laravel project (version 8+ recommended)
- An active Brevo account ([Sign up here](https://www.brevo.com/))
- SMTP credentials from Brevo

## SMTP Configuration
Update your Laravel project's `.env` file with the following configuration:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=YOUR_USERNAME
MAIL_PASSWORD=YOUR_PASSWORD
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=pr@zavodshow.ru
MAIL_FROM_NAME=ЗаводШоу
```

### Steps to Obtain SMTP Credentials
1. Log in to your Brevo account: [Brevo Dashboard](https://app.brevo.com/)
2. Navigate to **SMTP & API Keys**: [SMTP Settings](https://app.brevo.com/settings/keys/smtp)
3. Copy your SMTP username and password
4. Replace `MAIL_USERNAME` and `MAIL_PASSWORD` in your `.env` file with these credentials

## Testing the Email Configuration
To verify that the email service is correctly set up, run the following command in your terminal:

```bash
php artisan tinker
```

Then execute the following command inside Tinker:

```php
Mail::raw('Test email from Laravel', function ($message) {
    $message->to('your-email@example.com')->subject('Test Email');
});
```

If the setup is correct, you should receive an email at the specified address.

## Additional Configuration
### Queueing Emails
To improve performance, consider queueing emails instead of sending them synchronously. Update your `.env` file:

```env
MAIL_MAILER=log
QUEUE_CONNECTION=database
```

Run migrations to set up the queue:

```bash
php artisan queue:table
php artisan migrate
```

Dispatch queued emails using:

```bash
php artisan queue:work
```

## Troubleshooting
If you encounter issues:
- Ensure your Brevo SMTP credentials are correct
- Check that your hosting provider allows outbound SMTP traffic
- Verify email logs in `storage/logs/laravel.log`
- Try disabling firewall or security rules blocking SMTP

For more details, refer to Laravel's official [email documentation](https://laravel.com/docs/mail) or Brevo's [SMTP documentation](https://help.brevo.com/hc/en-us/articles/209499461-What-is-SMTP-and-how-do-I-use-it-).

---
