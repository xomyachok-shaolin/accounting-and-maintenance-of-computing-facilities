using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Location
{
    public int Id { get; set; }
    public string Room { get; set; }
    public string House { get; set; }
    /* EF Relations */
    public ICollection<Workstation> Workstations { get; set; }
    
    public ICollection<Device> Devices { get; set; }

    public int? IdEmployee { get; set; }
    public virtual Employee Employee { get; set; }
}