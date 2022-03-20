namespace WebApi.Models.Users;

public class UpdateRequest
{
    public string Username { get; set; }
    public string Mail { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string Patronymic { get; set; }
    public string Password { get; set; }

    public string ImageName { get; set; }
    public IFormFile ImageFile { get; set; }
}