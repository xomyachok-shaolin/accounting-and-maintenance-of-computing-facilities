using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.Locations;
public class LocationRequest
{
    [Required]
    public string House { get; set; }

    [Required]
    public string Room { get; set; }
    public int Responsible { get; set; }
}