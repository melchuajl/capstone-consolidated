namespace UserV2API.Exceptions
{
    public class PasswordAlreadyExistsException: Exception
    {
        public PasswordAlreadyExistsException() { }
        public PasswordAlreadyExistsException(string message) : base(message) { }
    }
}
