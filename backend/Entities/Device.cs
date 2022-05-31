using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Device
{

    public int Id { get; set; }
    public string InventoryNumber { get; set; }

    public int IdDeviceModel { get; set; }
    public DeviceModel DeviceModel { get; set; }


    public int? IdWrittingOffAct { get; set; }
    public virtual WrittingOffAct WrittingOffAct { get; set; }

    public DateTime? DateOfLastService { get; set; }
    public DateTime? DateOfNextService { get; set; }

    public bool IsDeleted { get; set; }

    public ICollection<DeviceTransfer> DeviceTransfers { get; set; }
    public ICollection<TaskDeviceTransfer> TaskDeviceTransfers { get; set; }
}