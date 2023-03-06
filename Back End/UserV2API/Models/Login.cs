using System.ComponentModel.DataAnnotations;

namespace UserV2API.Models
{
    public class Login
    {
        [Required, EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
