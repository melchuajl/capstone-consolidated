using Consul;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace UserV2API
{
    public static class ServiceRegistrationExtention
    {
        public static IApplicationBuilder UseConsul(this IApplicationBuilder app , IConfiguration config)
        {
            var consulClient = app.ApplicationServices.GetRequiredService<IConsulClient>();
            var logger = app.ApplicationServices.GetRequiredService<ILoggerFactory>().CreateLogger("AppExtension");
            var lifetime = app.ApplicationServices.GetRequiredService<IHostApplicationLifetime>();

            // This is registration configuration that I am reading from appsettings.json file
            var registration = new AgentServiceRegistration()
            {
                ID = config["ConsulConfig:ServiceName"] ,
                Name = config["ConsulConfig:ServiceName"] ,
                Address = config["ConsulConfig:ServiceHost"] ,
                Port = int.Parse(config["ConsulConfig:ServicePort"])
                
            };

            logger.LogInformation("Registering with consul");
            //Here I am registering the service with service ID
            consulClient.Agent.ServiceDeregister(registration.ID).ConfigureAwait(true);
            consulClient.Agent.ServiceRegister(registration).ConfigureAwait(true);

            lifetime.ApplicationStopped.Register(() =>
            {
                logger.LogInformation("Unregistering service from consul");
                consulClient.Agent.ServiceDeregister(registration.ID).ConfigureAwait(!true);
            });
            return app;

        }
    }
}
