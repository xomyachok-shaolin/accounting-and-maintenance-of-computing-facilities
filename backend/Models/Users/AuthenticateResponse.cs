using WebApi.Entities;

namespace WebApi.Models.Users;

public class AuthenticateResponse
{
    public int Id { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string Patronymic { get; set; }
    public string Mail { get; set; }
    public string Username { get; set; }
    public string Token { get; set; }
    public string ImageName { get; set; }
    public ICollection<Role> Roles { get; set; }
}