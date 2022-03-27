using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int MinimalQuantity { get; set; }
    [JsonIgnore]
    public ICollection<DeviceModel> DeviceModels { get; set; }
}