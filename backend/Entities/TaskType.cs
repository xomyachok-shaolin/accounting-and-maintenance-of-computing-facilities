using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class TaskType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Task> Tasks { get; set; }
}