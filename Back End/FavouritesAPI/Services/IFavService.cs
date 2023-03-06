using FavouritesAPI.Models;

namespace FavouritesAPI.Services
{
    public interface IFavService
    {
        //methods to be defined when implemented by FavService
        Favourite AddToFavourites(Object favourite);
        void DeleteFavourite(string id);
        List<Favourite> GetAllFavourites();
        List<Favourite> GetAllFavsByUser(string user);
        Favourite GetById(string id);
    }
}
