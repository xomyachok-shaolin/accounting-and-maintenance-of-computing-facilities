using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Workstation
{
    public int Id { get; set; }
    public string RegisterNumber { get; set; }
    public string NetworkName { get; set; }
    public string IpAddress { get; set; }
    public bool IsDisassembled { get; set; }

    public ICollection<DeviceTransfer> DeviceTransfers { get; set; }
    public ICollection<TaskDeviceTransfer> TaskDeviceTransfers { get; set; }

    public ICollection<WorkstationTransfer> WorkstationTransfers { get; set; }
    public ICollection<TaskWorkstationTransfer> TaskWorkstationTransfers { get; set; }
}