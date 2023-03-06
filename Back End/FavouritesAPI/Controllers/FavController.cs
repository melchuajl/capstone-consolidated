using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using FavouritesAPI.Filters;
using FavouritesAPI.Models;
using FavouritesAPI.Services;

namespace FavouritesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //FavException attribute to handle any exception
    [FavException]
    public class FavController : ControllerBase
    {
        //inject dependency through constructor injection
        private readonly IFavService service;
        public FavController(IFavService service)
        {
            this.service = service;
        }

        //this action method is to retrieve all records based on user id
        [HttpGet("{user}")]
        public IActionResult GetAllFavsByUser(string user)
        {
            return Ok(service.GetAllFavsByUser(user));
        }

        //this action method retrieves all records
        [HttpGet("all")]
        public IActionResult GetAllFavs()
        {
            var res = service.GetAllFavourites();
            return Ok(res);
        }

        //this action method allows favourite to be stored
        [HttpPost("addtofav")]
        public IActionResult AddToFavourites(Object favourite)
        {
            
            var message = JsonConvert.SerializeObject("Item added to favourites");
            return StatusCode(201 , service.AddToFavourites(favourite));
        }

        //this action method will toggle the visibility of the favourite
        [HttpPost("removefav/{id}")]
        public IActionResult RemoveFavourite(string id)
        {
            service.DeleteFavourite(id);
            var message = JsonConvert.SerializeObject("Item removed from favourites");
            return Ok(message);
        }
    }
}
