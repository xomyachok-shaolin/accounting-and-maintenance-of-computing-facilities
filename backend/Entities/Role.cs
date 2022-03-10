using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }
    public char isWriteOff{ get; set; }
    public char isTransfer{ get; set; }
    public char isUpgrade{ get; set; }
    public char isEdit{ get; set; }   
    
    [JsonIgnore]
    /* EF Relations */
    public ICollection<User> Users { get; set; }
}