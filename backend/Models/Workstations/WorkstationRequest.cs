using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Workstations;
public class WorkstationRequest
{
    [Required]
    public string RegisterNumber { get; set; }
    [Required]
    public string IpAddrress{ get; set; }
    [Required]
    public string NetworkName { get; set; }
    [Required]
    public int Location { get; set; }
    [Required]
    public int Responsible { get; set; }
}