using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Devices;
public class DeviceParameterDeleteRequest
{
    [Required]
    public int DeviceModel { get; set; }
    [Required]
    public string DeviceParameter { get; set; }
}