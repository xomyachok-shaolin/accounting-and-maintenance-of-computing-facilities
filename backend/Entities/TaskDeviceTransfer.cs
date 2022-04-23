using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class TaskDeviceTransfer
{
    public int Id { get; set; }
    public int IdTask { get; set; }
    public Task Task { get; set; }
    public int IdDevice { get; set; }
    public Device Device { get; set; }
    public string UseType { get; set; }


    public int? IdLocation { get; set; }
    public virtual Location Location { get; set; }

    public int? IdWorkstation { get; set; }
    public virtual Workstation Workstation { get; set; }
}