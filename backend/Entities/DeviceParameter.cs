using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceParameter
{
    public int Id { get; set; }
    public string Name { get; set; }

    public ICollection<DeviceModel> DeviceModels { get; set; }
    public List<DeviceProperties> DeviceProperties { get; set; }
}