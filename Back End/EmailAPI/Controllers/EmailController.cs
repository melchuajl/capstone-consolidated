using EmailAPI.Models;
using EmailAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;


namespace EmailAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService service;

        //IConfiguration is an interface provided by the Microsoft.Extensions.Configuration package that represents a set of key-value application configuration properties.
        //This allows the controller to access the configuration settings for the application, such as the email server settings and credentials, without having to hardcode them into the controller code.
        //By passing in the IConfiguration object, the EmailController can access the configuration settings using the configuration field, which is then used in the EmailService to send emails with the correct settings.

        private readonly IConfiguration configuration;

        public EmailController(IEmailService service , IConfiguration configuration)
        {
            this.service = service;
            this.configuration = configuration;
        }

        //In each action, an instance of the EmailService is created with the configuration object injected into the controller's constructor.
        //The appropriate method is then called on the service object to send the email

        // Send verification email
        [HttpPost("register")]
        public IActionResult SendRegistrationEmail(string email , string token)
        {
            var emailService = new EmailService(configuration);
            emailService.SendRegistrationEmail(email , token);
            return Ok();
        }


        // Send verification confirmation email
        [HttpPost("verify")]
        public IActionResult SendVerificationConfirmationEmail(string email)
        {
            var emailService = new EmailService(configuration);
            emailService.SendVerificationConfirmationEmail(email);
            return Ok();
        }

        // Send password reset email
        [HttpPost("forgot-password")]
        public IActionResult SendPasswordForgotEmail(string email , string token)
        {
            var emailService = new EmailService(configuration);
            emailService.SendPasswordForgotEmail(email , token);
            return Ok();
        }

        // Send password reset confirmation email
        [HttpPost("reset-password")]
        public IActionResult SendPasswordForgotConfirmationEmail(string email)
        {
            var emailService = new EmailService(configuration);
            emailService.SendPasswordForgotConfirmationEmail(email);
            return Ok();
        }

        // Send account blocked email
        [HttpPost("blocked-email")]
        public IActionResult SendAccountBlockedEmail(string email)
        {
            var emailService = new EmailService(configuration);
            emailService.SendAccountBlockedEmail(email);
            return Ok();
        }

        // Send account Unblocked email
        [HttpPost("unblock-email")]
        public IActionResult SendAccountUnblockedEmail(string email)
        {
            var emailService = new EmailService(configuration);
            emailService.SendAccountUnblockedEmail(email);
            return Ok();
        }

        // Send confirmation email for change of password
        [HttpPost("change-password")]
        public IActionResult SendPasswordChangedEmail(string email)
        {
            var emailService = new EmailService(configuration);
            emailService.SendPasswordChangedEmail(email);
            return Ok();
        }

    }
}
