using UserV2API.Models;

namespace UserV2API.Repository
{
    public interface IUserRepository
    {
        //all methods to be defined when implemented by UserRepository
        List<User> GetUsers();
        User GetById(Guid id);
        User GetByEmail(string email);
        int Register(User user);
        int UpdateUser(Guid id , User user);
        bool Login(Login login);
        int ChangeUserStatus(Guid id , User user);
        User CheckPassword(ChangePW change);
        int ChangePassword(ChangePW change);
        User CheckToken(string token);
        int VerifyAccount(string token);
        int ForgetPassword(string email);
        User CheckFToken(string token);
        int ResetPassword(ResetPassword request);
    }
}
