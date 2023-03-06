using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FavouritesAPI.Models
{
    public class Favourite
    {
        [BsonId]
        public string FavId { get; set; } = Guid.NewGuid().ToString();
        public dynamic? SavedRoute { get; set; }
        public bool? isActive { get; set; } = true; //rather than deleting the favourite, it will just be hidden from user and stored for DA
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public dynamic? DirectionsResults { get; set; }
    }
}
