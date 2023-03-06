using MongoDB.Driver;
using FavouritesAPI.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;

namespace FavouritesAPI.Repository
{
    public class FavRepository : IFavRepository
    {
        //inject dependency through constructor injection
        private readonly FavDBContext db;
        public FavRepository(FavDBContext db)
        {
            this.db = db;
        }

        //this method will add favourite to the database
        public Favourite AddToFavourites(Object favourite)
        {
            var document = BsonSerializer.Deserialize<Favourite>(BsonDocument.Parse(favourite.ToString()));
            db.Favourites.InsertOne(document);
            return document;
        }

        //this method will toggle the favourite status to remove its visibility instead of removing entirely
        public void DeleteFavourite(string id)
        {
            var filter = Builders<Favourite>.Filter.Where(x => x.FavId== id);
            var update = Builders<Favourite>.Update
                .Set(x => x.isActive , false)
                .Set(x => x.UpdatedAt, DateTime.Now);
            db.Favourites.UpdateOne(filter, update);
        }

        //this method will retrieve all records
        public List<Favourite> GetAllFavourites()
        {
            var res = db.Favourites.Find(x => true).ToList();
            return res;
        }

        //this method will retrieve all records based on the user id provided
        public List<Favourite> GetAllFavsByUser(string user)
        {
            return db.Favourites.Find(x => x.CreatedBy == user).ToList();
        }

        //this method will retrieve record based on the id provided
        public Favourite GetById(string id)
        {
            return db.Favourites.Find(x => x.FavId == id).FirstOrDefault();
        }
    }
}
