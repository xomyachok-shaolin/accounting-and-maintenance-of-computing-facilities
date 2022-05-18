namespace WebApi.Entities;

using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class WrittingOffAct
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime DateOfDebit { get; set; }
    public ICollection<WrittingOffActFile> WrittingOffActFiles { get; set; }
    public ICollection<Device> Devices { get; set; }
}