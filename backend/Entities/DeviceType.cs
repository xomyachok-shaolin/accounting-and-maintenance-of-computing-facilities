using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class DeviceType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int MinimalQuantity { get; set; }
    public ICollection<DeviceModel> DeviceModels { get; set; }
}