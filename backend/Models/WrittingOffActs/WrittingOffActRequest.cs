using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.WrittingOffActs;
public class WrittingOffActRequest
{
    [Required]
    public string Name { get; set; }
    [Required]
    public DateTime DateOfDebit { get; set; }
    public ICollection<WrittingOffActFileRequest> Files { get; set; }
    public ICollection<string> DecommissionedDevices { get; set; }
}