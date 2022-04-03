namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Workstations;

public interface IWorkstationService
{
    IEnumerable<Workstation> GetAll();
    Workstation GetById(int id);
    void Create(WorkstationRequest model);
    void Update(int id, WorkstationRequest model);
    void Delete(int id);
}

public class WorkstationService : IWorkstationService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public WorkstationService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<Workstation> GetAll()
    {
        return _context.Workstations
            .Include(l => l.Employee); ;
    }
    public Workstation GetById(int id)
    {
        return getWorkstation(id);
    }

    public void Create(WorkstationRequest model)
    {
        // validate
        if (_context.Workstations.Any(x => x.RegisterNumber == model.RegisterNumber) 
            && _context.Workstations.Any(x => x.IsDisassembled == false))
            throw new AppException("Регистрационный № для рабочего места уже занят");

        Employee employee = _context.Employees.Where(e => e.Id == model.Responsible).FirstOrDefault();

        Location location = _context.Locations.Where(e => e.Id == model.Location).FirstOrDefault();

        Workstation Workstation = new Workstation
        {
            RegisterNumber = model.RegisterNumber,
            NetworkName = model.NetworkName,
            IpAddress = model.IpAddrress,
            Location = location,
            Employee = employee
        };

        // save Workstation
        _context.Workstations.Add(Workstation);
        _context.SaveChanges();
    }

    public void Update(int id, WorkstationRequest model)
    {
        var Workstation = getWorkstation(id);

        // validate
        if (Workstation.RegisterNumber != model.RegisterNumber)
        if (_context.Workstations.Any(x => x.RegisterNumber == model.RegisterNumber))
            throw new AppException("Регистрационный № для рабочего места уже занят");

        Employee employee = _context.Employees.Where(e => e.Id == model.Responsible).FirstOrDefault();
        Location location = _context.Locations.Where(e => e.Id == model.Location).FirstOrDefault();

        Workstation.RegisterNumber = model.RegisterNumber;
        Workstation.NetworkName = model.NetworkName;
        Workstation.IpAddress = model.IpAddrress;
        Workstation.Location = location;
        Workstation.Employee = employee;

        _context.Workstations.Update(Workstation);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var Workstation = getWorkstation(id);
        _context.Workstations.Remove(Workstation);
        _context.SaveChanges();
    }

    // helper methods

    private Workstation getWorkstation(int id)
    {
        var Workstation = _context.Workstations.Find(id);
        if (Workstation == null) throw new KeyNotFoundException("Рабочее место не найдено");
        return Workstation;
    }

}