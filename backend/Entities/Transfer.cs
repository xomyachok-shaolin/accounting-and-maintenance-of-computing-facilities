using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Transfer
{
    public int Id { get; set; }
    public DateTime DateOfInstallation { get; set; }
    public DateTime DateOfRemoval { get; set; }

    public int IdWorkstation { get; set; }
    [JsonIgnore]
    public Workstation Workstation { get; set; }
    public int IdDevice { get; set; }
    [JsonIgnore]
    public Device Device { get; set; }
    public int IdTask { get; set; }
    [JsonIgnore]
    public Task Task { get; set; }
}