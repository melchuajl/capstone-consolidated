using System.ComponentModel.DataAnnotations;

namespace UserV2API.Models
{
    public class ResetPassword
    {
        [Required]
        public string? Token { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required, Compare("Password")]
        public string? ConfirmPassword { get; set; }
    }
}
