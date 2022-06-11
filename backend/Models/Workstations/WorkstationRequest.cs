using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Workstations;
public class WorkstationRequest
{
    [Required]
    public string RegisterNumber { get; set; }
    public string IpAddress{ get; set; }
    [Required]
    public string NetworkName { get; set; }
    [Required]
    public int Location { get; set; }
    public int Responsible { get; set; }
    public ICollection<string> SetOfDevices { get; set; }
}