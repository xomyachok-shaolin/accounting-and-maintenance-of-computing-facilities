using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApi.Entities;

namespace WebApi.Models.DeviceTypes;
public class DeviceTypeRequest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int MinimalQuantity { get; set; }
    public int CurrentQuantity { get; set; }

}