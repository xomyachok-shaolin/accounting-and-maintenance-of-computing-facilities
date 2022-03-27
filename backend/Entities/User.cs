namespace WebApi.Entities;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string Patronymic { get; set; }
    public string LastName { get; set; }
    public string Mail { get; set; }
    public string Username { get; set; }

    [JsonIgnore]
    public string PasswordHash { get; set; }
    // 100
    public string ImageName { get; set; }
    [NotMapped]
    public string ImageFile { get; set; }

    /* EF Relations */
    public ICollection<Role> Roles { get; set; }
    public ICollection<Task> Tasks { get; set; }
}