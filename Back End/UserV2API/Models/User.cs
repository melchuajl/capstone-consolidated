using System.ComponentModel.DataAnnotations;

namespace UserV2API.Models
{
    public class User
    {
        public Guid UserId { get; set; } //better to use string rather than guid
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? VerificationToken { get; set; }
        public DateTime? VerifiedAt { get; set; } = null;
        public string? PasswordResetToken { get; set; } = null;
        public DateTime? ResetTokenExpires { get; set; } = null;
        public DateTime? DateOfBirth { get; set; }
        public bool? isActive { get; set; } = true;
        public bool? isAdmin { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public string? ProfilePicture { get; set; } = "Resources/Images/Default.png";
    }
}
