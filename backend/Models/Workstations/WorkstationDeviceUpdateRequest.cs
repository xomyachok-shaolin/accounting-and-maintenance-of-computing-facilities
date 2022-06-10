using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Workstations;

public class WorkstationDeviceUpdateRequest
{

    [Required]
    public int Location { get; set; }
    [Required]
    public bool IsReserve { get; set; }
    [Required]
    public bool IsCommonUse { get; set; }
    public ICollection<string> SetOfDevices { get; set; }
}