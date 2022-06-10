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
    void UpdateDevices(WorkstationDeviceUpdateRequest model);
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
            .Include(w => w.WorkstationTransfers)
                .ThenInclude(wt => wt.Employee)
            .Include(w => w.WorkstationTransfers)
                    .ThenInclude(wt => wt.Location)
            .Include(w => w.DeviceTransfers)
                .ThenInclude(dt => dt.Location)
            .Include(w => w.DeviceTransfers)
                .ThenInclude(dt => dt.Device)
                            .ThenInclude(d => d.DeviceModel)
                                .ThenInclude(dm => dm.DeviceType);
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
            IpAddress = model.IpAddress,
        };
        // save Workstation
        _context.Workstations.Add(Workstation);

        WorkstationTransfer workstationTransfer = new WorkstationTransfer
        {
            DateOfInstallation = DateTime.UtcNow,
            Workstation = Workstation,
            Location = location,
            Employee = employee
        };

        _context.WorkstationTransfers.Add(workstationTransfer);

        List<Device> devices = new List<Device>();

        if (model.SetOfDevices != null)
            foreach (string device in model.SetOfDevices)
            {
                Device device1 = _context.Devices.Where(e => e.InventoryNumber == device).FirstOrDefault();

                DeviceTransfer dt = _context.DeviceTransfers.Where(dt => dt.DateOfRemoval == null)
                    .Include(dt => dt.Device).Where(d => d.Device.InventoryNumber == device).SingleOrDefault();
                dt.DateOfRemoval = DateTime.UtcNow;
                _context.DeviceTransfers.Update(dt);

                DeviceTransfer transfer = new DeviceTransfer
                {
                    DateOfInstallation = DateTime.UtcNow,
                    Device = device1,
                    Workstation = Workstation,
                    UseType = "рабочее место"
                };

                device1.DeviceTransfers.Add(transfer);
            }

        _context.SaveChanges();
    }

    public void UpdateDevices(WorkstationDeviceUpdateRequest model)
    {
        foreach (string invNumber in model.SetOfDevices)
        {
            Device device = _context.Devices.Where(d => d.InventoryNumber == invNumber).SingleOrDefault();


            Location location = null;
            Workstation workstation = null;

            if (model.IsReserve || model.IsCommonUse)
                location = _context.Locations.Where(l => l.Id == model.Location).FirstOrDefault();
            else
                workstation = _context.Workstations.Where(w => w.Id == model.Location).FirstOrDefault();

            DeviceTransfer dt = _context.DeviceTransfers.Where(dt => dt.Device == device && dt.DateOfRemoval == null).FirstOrDefault();
            dt.DateOfRemoval = DateTime.UtcNow;
            _context.DeviceTransfers.Update(dt);

            DeviceTransfer transfer = null;
            if (model.IsReserve || model.IsCommonUse)
            {
                transfer = new DeviceTransfer
                {
                    DateOfInstallation = DateTime.UtcNow,
                    Device = device,
                    Location = location,
                    UseType = model.IsReserve ? "резерв" : "общее пользование"
                };
            }
            else
            {
                transfer = new DeviceTransfer
                {
                    DateOfInstallation = DateTime.UtcNow,
                    Device = device,
                    Workstation = workstation,
                    UseType = "рабочее место"
                };
            }
            device.DeviceTransfers.Add(transfer);
        }

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
        Workstation.IpAddress = model.IpAddress;

        // Workstation.Location = location;
        // Workstation.Employee = employee;

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