using FavouritesAPI.Models;

namespace FavouritesAPI.Repository
{
    public interface IFavRepository
    {
        //methods to be defined when implmented by FavRepository
        Favourite AddToFavourites(Object favourite);
        void DeleteFavourite(string id);
        List<Favourite> GetAllFavourites();
        List<Favourite> GetAllFavsByUser(string user);
        Favourite GetById(string id);
    }
}
