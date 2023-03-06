using MongoDB.Driver;

namespace FavouritesAPI.Models
{
    public class FavDBContext
    {
        MongoClient client;
        IMongoDatabase db;

        public FavDBContext(string connectionstring , string database)
        {
            var environment = Environment.GetEnvironmentVariable("BusyBeesFavDB");
            if ( environment != null )
            {
                client = new MongoClient(environment);
                db = client.GetDatabase("FavDB");

            }
            else
            {
                client = new MongoClient(connectionstring);
                db = client.GetDatabase(database);
            }
        }
        public IMongoCollection<Favourite> Favourites => db.GetCollection<Favourite>("Favourites");
    }
}
