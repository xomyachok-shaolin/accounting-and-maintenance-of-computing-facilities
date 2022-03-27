using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsWriteOff{ get; set; }
    public bool IsTransfer{ get; set; }
    public bool IsUpgrade { get; set; }
    public bool IsEditWS { get; set; }
    public bool IsEditTask { get; set; }

    [JsonIgnore]
    /* EF Relations */
    public ICollection<User> Users { get; set; }
}