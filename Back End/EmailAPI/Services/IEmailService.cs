using EmailAPI.Models;

namespace EmailAPI.Services
{
    public interface IEmailService
    {
        void SendEmail(EmailDto request);

        void SendRegistrationEmail(string email , string token);

        public void SendVerificationConfirmationEmail(string email);

        public void SendPasswordForgotEmail(string email , string token);

        public void SendPasswordForgotConfirmationEmail(string email);

        public void SendAccountBlockedEmail(string email);

        public void SendAccountUnblockedEmail(string email);

        public void SendPasswordChangedEmail(string email);

    }
}
