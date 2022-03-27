using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int IdDeviceType { get; set; }
    public DeviceType DeviceType { get; set; }

    public ICollection<DeviceParameter> DeviceParameters { get; set; }
    public List<DeviceProperties> DeviceProperties { get; set; }
}