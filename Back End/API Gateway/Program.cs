using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;

namespace API_Gateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddCors(options =>
              options.AddPolicy("CorsPolicy" , policy =>
              policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
            IConfiguration config = new ConfigurationBuilder().AddJsonFile("ocelot.json").Build();
            builder.Services.AddOcelot(config).AddConsul();
            
            var app = builder.Build();
            app.UseCors("CorsPolicy");
            app.UseOcelot().Wait();

            app.Run();
        }
    }
}