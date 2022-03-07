namespace WebApi.Entities;
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }
    public IList<UserRole> UserRoles { get; set; }
}