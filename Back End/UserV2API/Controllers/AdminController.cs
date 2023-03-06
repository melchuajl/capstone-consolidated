using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using UserV2API.Filters;
using UserV2API.Models;
using UserV2API.Service;

namespace UserV2API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [UserException]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        //inject dependencies through constructor injection
        private readonly IUserService service;
        private readonly IConfiguration config;
        public AdminController(IUserService service, IConfiguration config)
        {
            this.service = service;
            this.config = config;
        }

        //this action method will get all users
        [HttpGet("allusers")]
        public IActionResult GetAllUsers()
        {
            return Ok(service.GetUsers());
        }

        //this action method will user by id 
        [HttpGet("{id}")]
        public IActionResult GetUserById(Guid id)
        {
            return Ok(service.GetById(id));
        }

        //this method will change user status (block/unblock)
        [HttpPut("userstatus/{id}")]
        public async Task <IActionResult> ChangeUserStatus(Guid id , User user)
        {
            var result = service.GetById(id);
            service.ChangeUserStatus(id , user);
            var message = JsonConvert.SerializeObject("Profile updated successfully");
            if(result.isActive == false)
            {
                //send email to user to tell them that they are blocked for any reason
                var em = user.Email;

                using (var httpClient = new HttpClient())
                {
                    string emailUrl = config["EmailUrl"];
                    var requestData = new {em};
                    var requestJson = System.Text.Json.JsonSerializer.Serialize(requestData);
                    var requestContent = new StringContent(requestJson, System.Text.Encoding.UTF8, "application/json");
                    var response = await httpClient.PostAsync($"{emailUrl}/blocked-email?email={user.Email}", requestContent);
                }
            }
            else
            {
                //send email to user to tell them that their account has been reinstated
                var em = user.Email;

                using (var httpClient = new HttpClient())
                {
                    string emailUrl = config["EmailUrl"];
                    var requestData = new { em  };
                    var requestJson = System.Text.Json.JsonSerializer.Serialize(requestData);
                    var requestContent = new StringContent(requestJson, System.Text.Encoding.UTF8, "application/json");
                    var response = await httpClient.PostAsync($"{emailUrl}/unblock-email?email={user.Email}", requestContent);
                }
            }
            return Ok(message);
        }
    }
}
