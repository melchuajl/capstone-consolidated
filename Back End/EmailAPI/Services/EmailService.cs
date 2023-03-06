using EmailAPI.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace EmailAPI.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration config;

        public EmailService(IConfiguration config)
        {
            this.config = config;
        }

        //This method SendEmail sends an email using the MailKit library. 
        //It takes an EmailDto object as input, which contains the email address of the recipient, the email subject, and the email body.
        //Inside the method, it creates a new MimeMessage object, sets the sender and recipient email addresses, subject, and body of the email.
        //Then it creates a new SmtpClient object and connects to the email server using the host name and port number specified in the configuration file.
        //It also authenticates the email account using the email address and password specified in the configuration file.
        public void SendEmail(EmailDto request)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(config.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(request.To));
            email.Subject = request.Subject;
            email.Body = new TextPart(TextFormat.Html) { Text = request.Body };

            using var smtp = new SmtpClient();
            smtp.Connect(config.GetSection("EmailHost").Value , 587 , SecureSocketOptions.StartTls);
            smtp.Authenticate(config.GetSection("EmailUsername").Value , config.GetSection("EmailPassword").Value);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

        //The first thing the method does is create a path to an HTML file that contains the email message. It uses the Path.Combine method to combine the current directory with the file path.
        //Then, it creates a StreamReader object to read the contents of the HTML file. It uses the ReadToEnd method to read the entire file and store it in a message variable.
        //Next, it generates a URL that includes the token as a query string parameter. It uses the HttpUtility.UrlEncode method to encode the token for use in a URL. It replaces a placeholder string in the email message with this URL using the Replace method.
        //It then creates an EmailDto object with the email address, subject, and modified message body. 
        //Finally, it calls a SendEmail method to send the email to the specified email address.

        public void SendRegistrationEmail(string email , string token)
        {
            var path = Path.Combine(Environment.CurrentDirectory , "StaticFiles/register_mail.html");
            StreamReader sr = new StreamReader(path);
            var message = sr.ReadToEnd();

            var buttonUrl = config.GetSection("verify-email").Value;
            message = message.Replace("{verificationButtonUrl}" , buttonUrl);

            var url = $"{token}";
            message = message.Replace("{VerifyEmailToken}" , url);

            var emailDto = new EmailDto { To = email , Subject = "Welcome to Busy Bee Transport App - Confirm Your Email Address!" , Body = message };
            SendEmail(emailDto);
        }


        //sending a confirmation email to the user after their account has been successfully verified.
        public void SendVerificationConfirmationEmail(string email)
        {
            var message = "<p>Your account has been successfully verified.</p>";
            var emailDto = new EmailDto { To = email , Subject = "Busy Bee Transport App - Your Account is Now Officially Verified!" , Body = message };
            SendEmail(emailDto);
        }

        //sending an email to the user who has requested to reset their password.
        //The email contains a link that the user can click to reset their password.

        public void SendPasswordForgotEmail(string email , string token)
        {
            var path = Path.Combine(Environment.CurrentDirectory , "StaticFiles/ForgotPassword_mail.html");
            StreamReader sr = new StreamReader(path);
            var message = sr.ReadToEnd();

            var buttonUrl = config.GetSection("forgot-password-change").Value;
            message = message.Replace("{ForgotPasswordButtonUrl}" , buttonUrl);

            var url = $"{token}";
            message = message.Replace("{ForgotPasswordToken}" , url);

            var emailDto = new EmailDto { To = email , Subject = "Oops! You've forgotten your password at Busy Bee Transport App!" , Body = message };
            SendEmail(emailDto);
        }

        public void SendPasswordForgotConfirmationEmail(string email)
        {
            var message = "<p>Your password has been successfully reset.</p>";
            var emailDto = new EmailDto { To = email , Subject = "Success! Your password at Busy Bee Transport App has been reset!\r\n" , Body = message };
            SendEmail(emailDto);
        }

        //sending an email to the user to inform them that their account has been blocked due to suspicious activity and provides instructions to contact support for more information.
        public void SendAccountBlockedEmail(string email)
        {
            var message = "<p>Your account has been blocked due to suspicious activity. Please contact support for more information.</p>";
            var emailDto = new EmailDto { To = email , Subject = "Uh oh! Your account at Busy Bee Transport App has been blocked - Let's get it unblocked!" , Body = message };
            SendEmail(emailDto);
        }

        //sending an email to the user to inform them that their account has been unblocked and they can now log in.
        public void SendAccountUnblockedEmail(string email)
        {
            var message = "<p>Your account has been unblocked and you can now log in.</p>";
            var emailDto = new EmailDto { To = email , Subject = "Ready to hit the road again? Your account at Busy Bee Transport App is now unblocked!" , Body = message };
            SendEmail(emailDto);
        }

        // This method sends an email to the user to confirm that their password has been changed.
        public void SendPasswordChangedEmail(string email)
        {

            var message = "<p>Your password has been successfully changed.</p>";
            var emailDto = new EmailDto { To = email , Subject = "Voila! Your password at Busy Bee Transport App has been successfully changed" , Body = message };
            SendEmail(emailDto);
        }
    }
}
