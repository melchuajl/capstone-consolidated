namespace FavouritesAPI.Exceptions
{
    public class FavAlreadyExistsException: Exception
    {
        public FavAlreadyExistsException() { }
        public FavAlreadyExistsException(string message) : base(message) { }
    }
}
