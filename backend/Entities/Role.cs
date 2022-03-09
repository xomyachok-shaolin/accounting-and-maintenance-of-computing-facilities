using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }
    [JsonIgnore]
    /* EF Relations */
    public ICollection<User> Users { get; set; }
}