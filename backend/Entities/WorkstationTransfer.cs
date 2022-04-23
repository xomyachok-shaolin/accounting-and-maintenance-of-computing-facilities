using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class WorkstationTransfer
{
    public int Id { get; set; }
    public DateTime DateOfInstallation { get; set; }
    public DateTime? DateOfRemoval { get; set; }
    public int IdWorkstation { get; set; }
    public Workstation Workstation { get; set; }
    public int IdLocation { get; set; }
    public Location Location { get; set; }
    public int? IdEmployee { get; set; }
    public virtual Employee Employee { get; set; }
}