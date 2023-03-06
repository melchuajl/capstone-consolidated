using System.ComponentModel.DataAnnotations;

namespace UserV2API.Models
{
    public class ChangePW
    {
        [EmailAddress]
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; }
    }
}
