using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Device
{
    public int Id { get; set; }
    public string InventoryNumber { get; set; }

    public int IdDeviceModel { get; set; }
    public DeviceModel DeviceModel { get; set; }

    public string SerialNumber { get; set; }

    public int IdLocation { get; set; }
    public Location Location { get; set; }

    public DateTime? DateOfDebit { get; set; }
    public DateTime? DateOfLastService { get; set; }
    public DateTime? DateOfNextService { get; set; }
    public bool IsReserve { get; set; }
    public bool IsCommonUse { get; set; }

    public ICollection<Transfer> Transfers { get; set; }
}