using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Location
{
    public int Id { get; set; }
    public string Room { get; set; }
    public string House { get; set; }
    /* EF Relations */
    [JsonIgnore]
    public ICollection<Workstation> Workstations { get; set; }
    [JsonIgnore]
    public ICollection<Device> Devices { get; set; }

    public int? IdEmployee { get; set; }
    public virtual Employee Employee { get; set; }
}