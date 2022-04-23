using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceParameterValue
{
    public string Value { get; set; }

    public int DeviceId { get; set; }
    public Device Device { get; set; }

    public int DeviceParameterId { get; set; }
    public DeviceParameter DeviceParameter { get; set; }
}