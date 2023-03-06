using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserV2API.Repository;

namespace UserV2API.Service
{
    //inject dependencies through constructor injection
    public class TokenService : ITokenService
    {
        private readonly IUserRepository repo;
        private readonly IConfiguration config;
        public TokenService(IUserRepository repo, IConfiguration config)
        {
            this.repo = repo;
            this.config = config;
        }

        //this method will check for the isAdmin to assign the role in the claims, and generate the token
        public string GenerateToken(string email)
        {
            var user = repo.GetByEmail(email);
            string? role;
            if ( user.isAdmin == true )
            {
                role = "Admin";
            }
            else
            {
                role = "User";
            }
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            string sk = config["SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(sk));
            var creds = new SigningCredentials(key , SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "authapi" ,
                audience: "userapi" ,
                claims: claims ,
                expires: System.DateTime.Now.AddMinutes(60) ,
                signingCredentials: creds
                );

            var response = new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            };
            return JsonConvert.SerializeObject(response);
        }

        //this method will valid the token and return a boolean value as a result of the validation 
        public bool ValidateToken(string token , string secret)
        {
            try
            {
                string sk = config["SecretKey"];
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(sk));
                var handler = new JwtSecurityTokenHandler();
                var validations = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true ,
                    IssuerSigningKey = key ,

                    ValidateIssuer = true ,
                    ValidIssuer = "authapi" ,

                    ValidateAudience = true ,
                    ValidAudience = "userapi"
                };
                handler.ValidateToken(token , validations , out var securityToken);
                return true;
            }
            catch ( Exception )
            {
                return false;
            }
        }
    }
}
