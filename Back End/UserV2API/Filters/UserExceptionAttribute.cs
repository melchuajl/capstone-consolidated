using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using UserV2API.Exceptions;

namespace UserV2API.Filters
{
    public class UserExceptionAttribute: ExceptionFilterAttribute
    {
        //overriding OnException method derived from ExceptionFilterAttribute
        public override void OnException(ExceptionContext context)
        {
            //auto trigger when exception occur in the application when/where filter is applied 

            //get the message of exception occurred
            var message = context.Exception.Message;
            //get type of exception (format/dividebyzero/notfound/alreadyexist)
            var exceptionType = context.Exception.GetType();
            //cycle through the user-defined exceptions
            if ( exceptionType == typeof(UserAlreadyExistsException) )
            {
                context.Result = new ConflictObjectResult(message);
            }
            else if( exceptionType== typeof(UserNotFoundException) )
            {
                context.Result = new NotFoundObjectResult(message);
            }
            else if( exceptionType == typeof(PasswordAlreadyExistsException) )
            {
                context.Result = new ConflictObjectResult(message);
            }
            else if( exceptionType == typeof(InvalidTokenException) )
            {
                context.Result = new UnauthorizedObjectResult(message);
            }
            //all other exceptions
            else
            {
                //context.Result = new BadRequestObjectResult(message);
                context.Result = new BadRequestObjectResult("Something went wrong");
            }
        }
    }
}
