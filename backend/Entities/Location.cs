using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Location
{
    public int Id { get; set; }
    public string Room { get; set; }
    public string House { get; set; }
    /* EF Relations */
    public ICollection<WorkstationTransfer> WorkstationTransfers { get; set; }
    public ICollection<TaskWorkstationTransfer> TaskWorkstationTransfers { get; set; }

    public ICollection<DeviceTransfer> DeviceTransfers { get; set; }
    public ICollection<TaskDeviceTransfer> TaskDeviceTransfers { get; set; }

    public int? IdEmployee { get; set; }
    public virtual Employee Employee { get; set; }
}