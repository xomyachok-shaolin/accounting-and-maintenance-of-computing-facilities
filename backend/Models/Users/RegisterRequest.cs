using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Users;
public class RegisterRequest
{
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string Patronymic { get; set; }  
    [Required]
    public string Mail { get; set; }
    [Required]
    public string ImageName { get; set; }

    [NotMapped]
    public string ImageFile { get; set; }
    [NotMapped]
    public int[] Roles { get; set; }
}