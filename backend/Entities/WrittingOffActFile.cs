namespace WebApi.Entities;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class WrittingOffActFile
{
    public int Id { get; set; }

    public int IdWrittingOffAct { get; set; }
    public WrittingOffAct WrittingOffAct { get; set; }
    [Required]
    public string FileName { get; set; }
    [NotMapped]
    public string File { get; set; }
}