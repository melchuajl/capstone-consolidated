namespace UserV2API.Service
{
    public interface ITokenService
    {
        //methods to be defined when implemented by TokenService
        string GenerateToken(string email);
        bool ValidateToken(string token , string secret);
    }
}
