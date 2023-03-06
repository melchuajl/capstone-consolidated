using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using UserV2API.Exceptions;
using UserV2API.Filters;
using UserV2API.Models;
using UserV2API.Repository;
using UserV2API.Service;

namespace UserV2API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [UserException]
    public class UserController : ControllerBase
    {
        //injecting dependencies through constructor injection
        private readonly IUserService service;
        private readonly ITokenService token;
        private readonly IUserRepository repo;
        private readonly IConfiguration config;
        public UserController(IUserService service , ITokenService token, IConfiguration config, IUserRepository repo)
        {
            this.service = service;
            this.token = token;
            this.config = config;
            this.repo = repo;
        }

        //this action method is to get user details based on the id provided
        [HttpGet("{id}")]
        public IActionResult GetUserById(Guid id)
        {
            return Ok(service.GetById(id));
        }

        //this action method is to get user details based on the email provided
        [HttpGet("byemail")]
        public IActionResult GetUserByEmail(string email)
        {
            return Ok(service.GetByEmail(email));
        }

        //this action method is to add user details to the database
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            service.Register(user);
            var em = user.Email;
            var vtoken = user.VerificationToken;
            string emailUrl = config["EmailUrl"];
            var message = JsonConvert.SerializeObject("Profile created successfully!");

            using ( var httpClient = new HttpClient() )
            {
                var requestData = new { email = em , verificationToken = vtoken };
                var requestJson = System.Text.Json.JsonSerializer.Serialize(requestData);
                var requestContent = new StringContent(requestJson , System.Text.Encoding.UTF8 , "application/json");
                var response = await httpClient.PostAsync($"{emailUrl}/register?email={em}&token={vtoken}" , requestContent);
            }

            return StatusCode(201, message);
        }

        //this action method is to return the token based on the email from a successful login
        [HttpPost("login")]
        public IActionResult Login(Login login)
        {
            service.Login(login);
            return Ok(token.GenerateToken(login.Email));
        }

        //this action method is to update the user details based on the details provided
        [HttpPut("profile/{id}")]
        public IActionResult UpdateUser(Guid id , User user)
        {
            service.UpdateUser(id , user);
            var message = JsonConvert.SerializeObject("Profile updated successfully");
            return Ok(message);
        }

        //this action method is to authenticate the token which will be passed from the front-end 
        [HttpPost("authenticate")]
        public IActionResult isAuthenticated()
        {
            string secret = config["SecretKey"];
            //to grab header which contains Authorization
            var authHeader = Request.Headers["Authorization"];
            //if header contains Bearer after
            if ( authHeader.ToString().StartsWith("Bearer " , StringComparison.OrdinalIgnoreCase) )
            {
                //trim to reveal token
                var res = authHeader.ToString().Substring("Bearer ".Length).Trim();
                if ( token.ValidateToken(res , secret) )
                {
                    return Ok(true);
                }
                else
                {
                    //exception will be thrown if token received is invalid
                    throw new InvalidTokenException("Token is invalid!");
                }
            }
            return StatusCode(401 , false);
        }

        //this action method is to allow user to change password
        [HttpPut("changepassword")]
        public async Task <IActionResult> ChangePassword(ChangePW change)
        {
            var user = repo.CheckPassword(change);
            service.ChangePassword(change);
            string emailUrl = config["EmailUrl"];
            var message = JsonConvert.SerializeObject("Password changed successfully");

            using ( var httpClient = new HttpClient() )
            {
                var requestData = new { email = user.Email };
                var requestJson = System.Text.Json.JsonSerializer.Serialize(requestData);
                var requestContent = new StringContent(requestJson , System.Text.Encoding.UTF8 , "application/json");
                var response = await httpClient.PostAsync($"{emailUrl}/change-password?email={user.Email}" , requestContent);
            }
            return Ok(message);
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyAccount(string token)    
        {
            var user = repo.CheckToken(token);
            service.VerifyAccount(token);
            string emailUrl = config["EmailUrl"];
            var message = JsonConvert.SerializeObject("Account verified successfully");

            using ( var httpClient = new HttpClient() )
            {
                var requestData = new { email = user.Email };
                var requestJson = JsonConvert.SerializeObject(requestData);
                var requestContent = new StringContent(requestJson , Encoding.UTF8 , "application/json");
                var response = await httpClient.PostAsync($"{emailUrl}/verify?email={user.Email}" , requestContent);
            }

            return Ok(message);
        }


        [HttpPost("forgot-password")]

        public async Task<IActionResult> ForgotPassword(string email)
        {
            service.ForgetPassword(email);
            var user = service.GetByEmail(email);
            var vtoken = user.PasswordResetToken;
            string emailUrl = config["EmailUrl"];
            var message = JsonConvert.SerializeObject("you may now reset your password");

            using ( var httpclient = new HttpClient() )
            {
                var requestdata = new { email = email , verificationtoken = vtoken };
                var requestjson = System.Text.Json.JsonSerializer.Serialize(requestdata);
                var requestcontent = new StringContent(requestjson , System.Text.Encoding.UTF8 , "application/json");
                var response = await httpclient.PostAsync($"{emailUrl}/forgot-password?email={email}&token={vtoken}" , requestcontent);
            }

            return Ok(message);
        }

        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPassword request)
        {
            var user = repo.CheckFToken(request.Token);
            service.Resetpassword(request);
            string emailUrl = config["EmailUrl"];
            var message = JsonConvert.SerializeObject("Password successfully reset");


            using ( var httpClient = new HttpClient() )
            {
                var requestData = new { email = user.Email };
                var requestJson = System.Text.Json.JsonSerializer.Serialize(requestData);
                var requestContent = new StringContent(requestJson , System.Text.Encoding.UTF8 , "application/json");
                var response = await httpClient.PostAsync($"{emailUrl}/reset-password?email={user.Email}" , requestContent);
            }
            return Ok(message);
        }

    }
}
