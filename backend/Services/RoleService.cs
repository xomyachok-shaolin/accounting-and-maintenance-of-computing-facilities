namespace WebApi.Services;

using AutoMapper;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;

public interface IRoleService
{
    IEnumerable<Role> GetAll();
    Role GetById(int id);
    void Create(Role model);
    void Update(int id, Role model);
    void Delete(int id);
}

public class RoleService : IRoleService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public RoleService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<Role> GetAll()
    {
        return _context.Roles;
    }

    public Role GetById(int id)
    {
        return getRole(id);
    }

    public void Create(Role model)
    {
        // validate
        if (_context.Roles.Any(x => x.Name == model.Name))
            throw new AppException("Наименование для роли '" + model.Name + "' уже занято");

        // map model to new role object
        var role = _mapper.Map<Role>(model);


        // save role
        _context.Roles.Add(role);
        _context.SaveChanges();
    }

    public void Update(int id, Role model)
    {
        var role = getRole(id);

        // validate
        if (model.Name != role.Name && _context.Roles.Any(x => x.Name == model.Name))
            throw new AppException("Наименование для роли '" + model.Name + "' уже занято");

        
        // copy model to user and save
        _mapper.Map(model, role);
        _context.Roles.Update(role);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var role = getRole(id);
        _context.Roles.Remove(role);
        _context.SaveChanges();
    }

    // helper methods

    private Role getRole(int id)
    {
        var role = _context.Roles.Find(id);
        if (role == null) throw new KeyNotFoundException("Роль не найдена");
        return role;
    }

}