using FavouritesAPI.Exceptions;
using FavouritesAPI.Models;
using FavouritesAPI.Repository;

namespace FavouritesAPI.Services
{
    public class FavService : IFavService
    {
        //inject dependency through constructor injeciton
        private readonly IFavRepository repo;
        public FavService(IFavRepository repo)
        {
            this.repo = repo;
        }

        //this method will add favourite
        public Favourite AddToFavourites(Object favourite)
        {
            return repo.AddToFavourites(favourite);
        }

        //this method will "delete" favourite by toggling its visibility based on id provided
        public void DeleteFavourite(string id)
        {
            if(repo.GetById(id) == null) 
            {
                throw new FavNotFoundException("Item does not exist");
            }
            repo.DeleteFavourite(id);
        }

        //this method will retrieve all records
        public List<Favourite> GetAllFavourites()
        {
            if(repo.GetAllFavourites().Count == 0)
            {
                throw new FavNotFoundException("There is nothing in favourites at the moment");
            }
            return repo.GetAllFavourites();
        }

        //this method will retrieve all favourites based on user id
        public List<Favourite> GetAllFavsByUser(string user)
        {
            if(repo.GetAllFavsByUser(user).Count == 0 )
            {
                throw new FavNotFoundException("There is nothing in your favourites at the moment");
            }
            return repo.GetAllFavsByUser(user);
        }

        //this method will retrieve records based on id 
        public Favourite GetById(string id)
        {
            if(repo.GetById(id) == null )
            {
                throw new FavNotFoundException("Item does not exist");
            }
            return repo.GetById(id);
        }
    }
}
