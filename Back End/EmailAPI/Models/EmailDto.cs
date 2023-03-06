namespace EmailAPI.Models
{
    // This class is to represent an email message in a simplified form, with three properties:
    // 1. To: A string that represents the recipient's email address.
    // 2. Subject: A string that represents the subject of the email.
    // 3. Body: A string that represents the body of the email.
    public class EmailDto
    {
        public string To { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
