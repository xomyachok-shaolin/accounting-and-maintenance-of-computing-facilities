namespace WebApi.Entities;

using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public List<Role> Roles { get; set; }= new List<Role>();

    [JsonIgnore]
    public string PasswordHash { get; set; }
}