using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FavouritesAPI.Models;
using FavouritesAPI.Repository;
using FavouritesAPI.Services;
using Consul;
using FavouritesAPI;

namespace FavouritesAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            //to implement cors policy to allow access from front-end
            builder.Services.AddCors(options =>
               options.AddPolicy("Access User Fav API" , policy =>
               policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            //to resolve connection
            builder.Services.AddScoped<FavDBContext>(provider =>
            {
                var connectionString = "mongodb://localhost:27017";
                var databaseName = "favdb";
                return new FavDBContext(connectionString , databaseName);
            });
            //resolve dependencies
            builder.Services.AddScoped<IFavRepository, FavRepository>();
            builder.Services.AddScoped<IFavService, FavService>();
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
            app.UseCors("Access User Fav API");
            app.UseConsul(builder.Configuration);
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}