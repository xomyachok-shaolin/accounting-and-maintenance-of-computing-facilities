using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceParameter
{
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<Device> Device { get; set; }
    public List<DeviceParameterValue> DeviceParameterValues { get; set; }
}