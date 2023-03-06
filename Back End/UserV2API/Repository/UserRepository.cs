using BCrypt.Net;
using System.Security.Cryptography;
using UserV2API.Models;
using UserV2API.Service;

namespace UserV2API.Repository
{
    public class UserRepository : IUserRepository
    {
        //injecting dependency through constructor injection
        private readonly DataContext db;
        public UserRepository(DataContext db)
        {
            this.db = db;
        }

        //this method will change user's password and update the time of update
        public int ChangePassword(ChangePW change)
        {
            var u = CheckPassword(change);
            u.UpdatedAt = DateTime.Now;
            u.Password = BCrypt.Net.BCrypt.HashPassword(change.NewPassword);
            db.Entry<User>(u).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return db.SaveChanges();
        }

        //this method will change user status (block/unblock)
        public int ChangeUserStatus(Guid id , User user)
        {
            var u = GetById(id);
            u.isActive = user.isActive;
            u.UpdatedBy = user.UpdatedBy;
            u.UpdatedAt = DateTime.Now;
            db.Entry<User>(u).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return db.SaveChanges();
        }

        //this method will return user record based on reset password token
        public User CheckFToken(string token)
        {
            return db.Users.FirstOrDefault(x => x.PasswordResetToken == token);
        }

        //this method will check for password when user change their password
        public User CheckPassword(ChangePW change)
        {
            var u = db.Users.FirstOrDefault(x => x.Email == change.Email);
            bool validPassword = BCrypt.Net.BCrypt.Verify(change.OldPassword, u.Password);
            if (validPassword)
            {
                return u;
            }
            return null;
        }

        //this method will return user record based on verification token
        public User CheckToken(string token)
        {
            return db.Users.FirstOrDefault(x => x.VerificationToken == token);
        }

        //this method will create a forget password token when user actuate "forget password" on front-end
        public int ForgetPassword(string email)
        {
            var u = GetByEmail(email);
            u.PasswordResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            u.ResetTokenExpires = DateTime.Now.AddDays(1);
            db.Entry<User>(u).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return db.SaveChanges();
        }

        //this method will return user record based on email
        public User GetByEmail(string email)
        {
            return db.Users.FirstOrDefault(x => x.Email == email);
        }

        //this method will return user record based on user id
        public User GetById(Guid id)
        {
            return db.Users.FirstOrDefault(x => x.UserId == id);
        }

        //this method will return all user records
        public List<User> GetUsers()
        {
            return db.Users.ToList();
        }

        //this method will check for login input and return a boolean value
        public bool Login(Login login)
        {
            var u = db.Users.FirstOrDefault(x => x.Email == login.Email);
            return BCrypt.Net.BCrypt.Verify(login.Password , u.Password);
        }

        //this method will add user record
        public int Register(User user)
        {
            if ( user.Email.EndsWith("@busybees.com") || user.Email.StartsWith("busybees") )
            {
                user.isAdmin = true;
                user.ProfilePicture = "Resources/Images/Admin.png";
            }
            else
            {
                user.isAdmin = false;
            }
            user.UserId = Guid.NewGuid();
            user.CreatedBy = user.UserId.ToString();
            user.VerifiedAt = null;
            user.ResetTokenExpires = null;
            user.PasswordResetToken= null;
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            user.VerificationToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            db.Users.Add(user);
            return db.SaveChanges();
        }

        //this method will update user when they input the correct forget password token and the necessary password fields, and remove the existing token and expiry field
        public int ResetPassword(ResetPassword request)
        {
            var u = CheckFToken(request.Token);
            u.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            u.PasswordResetToken = null;
            u.ResetTokenExpires = null;
            db.Entry<User>(u).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return db.SaveChanges();
        }

        //this method will update user record based on user id and input
        public int UpdateUser(Guid id , User user)
        {
            var u = GetById(id);
            u.FirstName = user.FirstName;
            u.LastName = user.LastName;
            u.Email = user.Email;
            u.Password = user.Password;
            u.DateOfBirth = user.DateOfBirth;
            u.ProfilePicture = user.ProfilePicture;
            u.UpdatedBy = user.UpdatedBy;
            u.UpdatedAt = DateTime.Now;
            db.Entry<User>(u).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            //db.Users.Update(u);
            return db.SaveChanges();
        }

        //this method will verify token and update the time when it's verified
        public int VerifyAccount(string token)
        {
            var v = CheckToken(token);
            v.VerifiedAt = DateTime.Now;
            db.Entry<User>(v).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            return db.SaveChanges();
        }
    }
}
