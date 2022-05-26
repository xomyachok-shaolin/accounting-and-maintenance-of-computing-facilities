using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Devices;
public class DeviceParameterRequest
{
    [Required]
    public int Device { get; set; }
    [Required]
    public string DeviceParameterValue { get; set; }
    [Required]
    public int DeviceParameter { get; set; }
}