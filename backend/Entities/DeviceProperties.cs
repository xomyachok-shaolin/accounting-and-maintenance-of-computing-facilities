using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceProperties
{
    public string Description { get; set; }

    public int DeviceModelId { get; set; }
    public DeviceModel DeviceModel { get; set; }

    public int DeviceParameterId { get; set; }
    public DeviceParameter DeviceParameter { get; set; }
}