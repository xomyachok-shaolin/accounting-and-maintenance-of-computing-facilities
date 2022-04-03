using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Devices;
public class DeviceRequest
{
    [Required]
    public string DeviceModel { get; set; }
    [Required]
    public string InventoryNumber { get; set; }
    [Required]
    public string SerialNumber { get; set; }
    [Required]
    public int DeviceType { get; set; }
    [Required]
    public int Location { get; set; }
    [Required]
    public bool IsReserve { get; set; }
    [Required]
    public bool IsCommonUse { get; set; }
}