using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Task
{
    public int Id { get; set; }
    public DateTime DateCreated { get; set; }
    public int IdUser { get; set; }
    public User User { get; set; }
    public int IdTaskType { get; set; }
    public TaskType TaskType { get; set; }
    public ICollection<Transfer> Transfers { get; set; }
    public string Comment { get; set; }
}