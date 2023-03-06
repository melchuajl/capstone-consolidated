using Consul;
using EmailAPI.Services;

namespace EmailAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IEmailService , EmailService>();
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
            app.UseConsul(builder.Configuration);
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}