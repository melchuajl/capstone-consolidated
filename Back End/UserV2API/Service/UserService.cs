using System.Diagnostics.Eventing.Reader;
using UserV2API.Exceptions;
using UserV2API.Models;
using UserV2API.Repository;

namespace UserV2API.Service
{
    public class UserService : IUserService
    {
        //injecting dependency through constructor injection
        private readonly IUserRepository repo;
        public UserService(IUserRepository repo)
        {
            this.repo = repo;
        }

        //this method will change the password once the passwords check out
        public int ChangePassword(ChangePW change)
        {
            var checkpw = repo.CheckPassword(change);
            if ( checkpw == null && change.NewPassword == change.ConfirmPassword )
            {
                //exception will be thrown if user record can't be found
                throw new UserNotFoundException("Please check your passwords again"); // "The email and password which you've entered can't be found in our system"
            }
            else if ( checkpw != null && BCrypt.Net.BCrypt.Verify(change.NewPassword, checkpw.Password) || BCrypt.Net.BCrypt.Verify(change.ConfirmPassword , checkpw.Password))
            {
                //exception will be thrown if the user entered the same password as the one which is already in the system
                throw new PasswordAlreadyExistsException(message: "The new password which you've entered can't be the same as your previous password");
            }
            return repo.ChangePassword(change);
        }

        //this method will change the user status (block/unblock) if user record is found based on user id
        public int ChangeUserStatus(Guid id , User user)
        {
            if ( repo.GetById(id) == null )
            {
                //exception thrown if user id does not exist in the database
                throw new UserNotFoundException($"User with id: {id} does not exist");
            }
            return repo.ChangeUserStatus(id , user);
        }

        //this method will generate a forget password token if the user record is found based on user email
        public int ForgetPassword(string email)
        {
            if ( repo.GetByEmail(email) == null )
            {
                //exception thrown if user record based on email provided can't be found
                throw new UserNotFoundException($"User with email: {email} does not exist");
            }
            return repo.ForgetPassword(email);
        }

        //this method will retrieve user record based on email provided
        public User GetByEmail(string email)
        {
            if ( repo.GetByEmail(email) == null )
            {
                //exception thrown if user record based on email provided can't be found
                throw new UserNotFoundException($"User with email: {email} does not exist");
            }
            return repo.GetByEmail(email);
        }

        //this method will retrieve user record based on user id
        public User GetById(Guid id)
        {
            if ( repo.GetById(id) == null )
            {
                //exception thrown if user id does not exist in the database
                throw new UserNotFoundException($"User with id: {id} does not exist");
            }
            return repo.GetById(id);
        }

        //this method will retrieve all user records
        public List<User> GetUsers()
        {
            if ( repo.GetUsers().Count == 0 )
            {
                //exception thrown if there isn't any user at the moment
                throw new UserNotFoundException("There isn't any user at the moment");
            }
            return repo.GetUsers();
        }

        //this method will return a boolean based on the validation of the email and password provided
        public bool Login(Login login)
        {
            var v = repo.GetByEmail(login.Email);
            if ( v == null )
            {
                //exception will be thrown if email provided does not exist in the database
                throw new UserNotFoundException("User not found. Please register");
            }
            else if ( repo.Login(login) && v.VerifiedAt == null)
            {
                //exception will be thrown if login returns true, but user is not verified yet
                throw new UserNotFoundException("User not verified");
            }
            else if(!BCrypt.Net.BCrypt.Verify(login.Password, v.Password))
            {
                //exception will be thrown if password does not match the one in the system
                throw new UserNotFoundException("Invalid password");
            }
            return repo.Login(login);
        }

        //this method will add a user record
        public int Register(User user)
        {
            if ( repo.GetByEmail(user.Email) != null )
            {
                //exception will be thrown if email already exists in the database
                throw new UserAlreadyExistsException("Email already exists!");
            }
            return repo.Register(user);
        }

        //this method will reset user password based on the validity of the forget password token
        public int Resetpassword(ResetPassword request)
        {
            var u = repo.CheckFToken(request.Token);
            if(u == null)
            {
                //exception will be thrown if user record based on forget password token can't be found, or if the token has expired
                throw new InvalidTokenException("Token is invalid!");
            }else if ( u.ResetTokenExpires < DateTime.Now )
            {
                throw new InvalidTokenException("Token has expired!");
            }
            return repo.ResetPassword(request);
        }

        //this method will update the user record based on the user id and input provided
        public int UpdateUser(Guid id , User user)
        {
            if ( repo.GetById(id) == null )
            {
                //exception thrown if user id does not exist in the database
                throw new UserNotFoundException($"User with id: {id} does not exist");
            }
            return repo.UpdateUser(id , user);
        }

        //this method will verify the user based on the verification token provided
        public int VerifyAccount(string token)
        {
            if(repo.CheckToken(token) == null )
            {
                //exception will be thrown if the token input can't be found in the database
                throw new InvalidTokenException("Token is invalid!");
            }
            return repo.VerifyAccount(token);
        }
    }
}
