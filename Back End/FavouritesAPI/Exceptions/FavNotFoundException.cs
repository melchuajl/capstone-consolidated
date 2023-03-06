namespace FavouritesAPI.Exceptions
{
    public class FavNotFoundException: Exception
    {
        public FavNotFoundException() { }
        public FavNotFoundException(string message) : base(message) { }
    }
}
