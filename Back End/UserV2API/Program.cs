using Consul;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserV2API.Models;
using UserV2API.Repository;
using UserV2API.Service;

namespace UserV2API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
               options.AddPolicy("CorsPolicy" , policy =>
               policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("SecretKey").Value));
            //specify mechanism for authentication purposes
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x => x.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
            {
                //valid token based on (token validation) parameters specified - all parameters must match the token generating api
                ValidateIssuerSigningKey = true ,
                IssuerSigningKey = key ,

                ValidateIssuer = true ,
                ValidIssuer = "authapi" ,

                ValidateAudience = true ,
                ValidAudience = "userapi"
            });
            builder.Services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var con = Environment.GetEnvironmentVariable("BusyBeesUserDB");
            if ( con == null )
            {
                builder.Services.AddDbContext<DataContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("UserConnect")));
            }
            else
            {
                builder.Services.AddDbContext<DataContext>(options =>
                    options.UseSqlServer(con));
            }
            builder.Services.AddScoped<IUserRepository , UserRepository>();
            builder.Services.AddScoped<IUserService , UserService>();
            builder.Services.AddScoped<ITokenService , TokenService>();
            //Adding of Consul
            var consulserver = Environment.GetEnvironmentVariable("consulserver");
            builder.Services.AddSingleton<IConsulClient , ConsulClient>(p => new ConsulClient(consulConfig =>
            {
                if ( consulserver == null )
                {
                    consulConfig.Address = new System.Uri(builder.Configuration["ConsulConfig:ConsulAddress"]);
                }
                else
                {
                    consulConfig.Address = new System.Uri(consulserver);
                }
            }));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if ( app.Environment.IsDevelopment() )
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("CorsPolicy");
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory() , @"Resources")) ,
                RequestPath = new PathString("/Resources")
            });
            app.UseConsul(builder.Configuration);
            app.UseAuthentication().UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}