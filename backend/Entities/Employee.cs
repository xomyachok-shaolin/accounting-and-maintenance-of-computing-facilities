using System.Text.Json.Serialization;

namespace WebApi.Entities;

public class Employee
{
    public int Id { get; set; }
    public string PersonnelNumber { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string Patronymic { get; set; }

    public string Position { get; set; }
    public string Department { get; set; }

    /* EF Relations */

    [JsonIgnore]
    public ICollection<Workstation> Workstations { get; set; }

    [JsonIgnore]
    public ICollection<Location> Locations { get; set; }
}
