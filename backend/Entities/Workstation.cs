using System.Text.Json.Serialization;

namespace WebApi.Entities;
public class Workstation
{
    public int Id { get; set; }
    public string RegisterNumber { get; set; }
    public string NetworkName { get; set; }
    public string IpAddress { get; set; }
    public bool IsDisassembled { get; set; }

    public int IdEmployee { get; set; }
    public Employee Employee { get; set; }
    public int IdLocation { get; set; }
    public Location Location { get; set; }
    public ICollection<Transfer> Transfers { get; set; }
}