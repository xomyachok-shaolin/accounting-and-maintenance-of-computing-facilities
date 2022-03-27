namespace WebApi.Services;

using AutoMapper;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;

public interface IEmployeeService
{
    IEnumerable<Employee> GetAll();
    Employee GetById(int id);
}

public class EmployeeService : IEmployeeService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public EmployeeService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<Employee> GetAll()
    {
        return _context.Employees;
    }

    public Employee GetById(int id)
    {
        return getEmployee(id);
    }

    // helper methods

    private Employee getEmployee(int id)
    {
        var Employee = _context.Employees.Find(id);
        if (Employee == null) throw new KeyNotFoundException("Сотрудник не найден");
        return Employee;
    }

}