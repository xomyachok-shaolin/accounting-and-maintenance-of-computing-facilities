using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Models.WrittingOffActs;
public class WrittingOffActFileRequest
{
    [Required]
    public string FileName { get; set; }
    
    [NotMapped]
    public string Base64 { get; set; }
}