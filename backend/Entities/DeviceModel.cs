using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using WebApi.Models.DeviceTypes;

namespace WebApi.Entities;
public class DeviceModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int IdDeviceType { get; set; }
    public DeviceType DeviceType { get; set; }
    [NotMapped]
    public int DeviceTypeRequestId { get; set; }
    [NotMapped]
    public DeviceTypeRequest DeviceTypeRequest { get; set; }


    public ICollection<Device> Devices { get; set; }
}