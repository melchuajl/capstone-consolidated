using FavouritesAPI.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace FavouritesAPI.Filters
{
    public class FavExceptionAttribute: ExceptionFilterAttribute
    {
        //overriding OnException method derived from ExceptionFilterAttribute
        public override void OnException(ExceptionContext context)
        {
            //auto trigger when exception occur in the application when/where filter is applied 

            //get the message of exception occurred
            var message = context.Exception.Message;
            //get type of exception (format/dividebyzero/notfound/alreadyexist)
            var exception = context.Exception.GetType();
            //cycle through the user-defined exceptions
            if ( exception == typeof(FavAlreadyExistsException))
            {
                context.Result = new ConflictObjectResult(message);
            }
            else if(exception == typeof(FavNotFoundException) )
            {
                context.Result = new NotFoundObjectResult(message);
            }
            //any other exceptions
            else
            {
                context.Result = new BadRequestObjectResult(message);
            }
        }
    }
}
