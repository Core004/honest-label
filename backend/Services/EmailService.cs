using System.Net;
using System.Net.Mail;

namespace HonestLabel.API.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    Task SendInquiryNotificationAsync(string customerName, string customerEmail, string message);
    Task SendInquiryConfirmationAsync(string customerEmail, string customerName);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body, bool isHtml = true)
    {
        try
        {
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUser = _configuration["Email:SmtpUser"];
            var smtpPass = _configuration["Email:SmtpPass"];
            var fromEmail = _configuration["Email:FromEmail"] ?? smtpUser;
            var fromName = _configuration["Email:FromName"] ?? "Honest Label";

            if (string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(smtpPass))
            {
                _logger.LogWarning("Email not configured. Skipping email to {To}", to);
                return;
            }

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail!, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };
            message.To.Add(to);

            await client.SendMailAsync(message);
            _logger.LogInformation("Email sent successfully to {To}", to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            throw;
        }
    }

    public async Task SendInquiryNotificationAsync(string customerName, string customerEmail, string message)
    {
        var adminEmail = _configuration["Email:AdminEmail"] ?? "hello@honestit.in";
        var subject = $"New Quote Request from {customerName}";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #666; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Quote Request</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Customer Name:</span> {customerName}
            </div>
            <div class='field'>
                <span class='label'>Email:</span> {customerEmail}
            </div>
            <div class='field'>
                <span class='label'>Message:</span>
                <p>{message}</p>
            </div>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(adminEmail, subject, body);
    }

    public async Task SendInquiryConfirmationAsync(string customerEmail, string customerName)
    {
        var subject = "Thank you for contacting Honest Label";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }}
        .content {{ padding: 20px; background-color: #f9f9f9; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Honest Label</h2>
        </div>
        <div class='content'>
            <p>Dear {customerName},</p>
            <p>Thank you for reaching out to Honest Label! We have received your inquiry and our team will get back to you within 24 hours.</p>
            <p>If you have any urgent questions, please feel free to call us at +91 95123 70018.</p>
            <p>Best regards,<br>The Honest Label Team</p>
        </div>
        <div class='footer'>
            <p>170/171, HonestIT - Corporate House, Ashram Rd, Ahmedabad, Gujarat 380009</p>
            <p>Phone: +91 95123 70018 | Email: hello@honestit.in</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(customerEmail, subject, body);
    }
}
