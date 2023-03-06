using UserV2API.Models;

namespace UserV2API.Service
{
    public interface IUserService
    {
        //methods to be defined when implemented by UserService
        List<User> GetUsers();
        User GetById(Guid id);
        User GetByEmail(string email);
        int Register(User user);
        int UpdateUser(Guid id , User user);
        bool Login(Login login);
        int ChangeUserStatus(Guid id , User user);
        int ChangePassword(ChangePW change);
        int VerifyAccount(string token);
        int ForgetPassword(string email);
        int Resetpassword(ResetPassword request);
    }
}
