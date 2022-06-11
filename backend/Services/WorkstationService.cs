namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Workstations;

public interface IWorkstationService
{
    IEnumerable<DeviceTransfer> GetAllDT();
    IEnumerable<WorkstationTransfer> GetAllWT();
    Workstation GetById(int id);
    void Create(WorkstationRequest model);
    void Update(string id, WorkstationRequest model);
    void UpdateDevices(WorkstationDeviceUpdateRequest model);
    void Delete(string id);
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

    public IEnumerable<DeviceTransfer> GetAllDT()
    {
        return _context.DeviceTransfers
                .Include(dt => dt.Location)
                .Include(dt => dt.Workstation)
                .Include(dt => dt.Device)
                      .ThenInclude(d => d.DeviceModel)
                        .ThenInclude(dm => dm.DeviceType);
    }
    public IEnumerable<WorkstationTransfer> GetAllWT()
    {
        return _context.WorkstationTransfers
            .Include(wt => wt.Workstation)
            .Include(wt => wt.Employee)
            .Include(wt => wt.Location);
    }
    public Workstation GetById(int id)
    {
        return getWorkstation(id);
    }

    public void Create(WorkstationRequest model)
    {
        // validate
        if (_context.Workstations.Any(x => x.RegisterNumber == model.RegisterNumber && x.IsDisassembled == false))
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

                _context.DeviceTransfers.Add(transfer);
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
            _context.DeviceTransfers.Add(transfer);
        }

        _context.SaveChanges();
    }

    public void Update(string id, WorkstationRequest model)
    {
        Workstation workstation = _context.Workstations.Where(w => w.RegisterNumber == id && w.IsDisassembled == false).SingleOrDefault();

        // validate
        if (workstation.RegisterNumber != model.RegisterNumber)
            if (_context.Workstations.Any(x => x.RegisterNumber == model.RegisterNumber))
                throw new AppException("Регистрационный № для рабочего места уже занят");

        Location location = _context.Locations.Where(l => l.Id == model.Location).FirstOrDefault();

            
            Employee employee = _context.Employees.Where(e => e.Id == model.Responsible).FirstOrDefault();

            WorkstationTransfer wt = _context.WorkstationTransfers.Where(wt => wt.IdWorkstation == workstation.Id
                && wt.DateOfRemoval == null).FirstOrDefault();
            wt.DateOfRemoval = DateTime.UtcNow;
            _context.WorkstationTransfers.Update(wt);
        if (model.Location == -1)
            location = _context.Locations.Where(l => l.Id == wt.IdLocation).FirstOrDefault();
        WorkstationTransfer transfer = new WorkstationTransfer
            {
                DateOfInstallation = DateTime.UtcNow,
                Workstation = workstation,
                Location = location,
                Employee = employee
            };


            _context.WorkstationTransfers.Add(transfer);


        
        workstation.RegisterNumber = model.RegisterNumber;
        workstation.NetworkName = model.NetworkName;
        workstation.IpAddress = model.IpAddress;

        if (model.SetOfDevices.Count == 0)
        {
            if (workstation.DeviceTransfers != null)
            foreach (var dt in workstation.DeviceTransfers) {
                if (dt.DateOfRemoval == null)
                {
                    dt.DateOfRemoval = DateTime.UtcNow;
                    _context.DeviceTransfers.Update(dt);
                }
            }
        }
 
        foreach (string invNumber in model.SetOfDevices)
        {
            Device device = _context.Devices.Where(d => d.InventoryNumber == invNumber).SingleOrDefault();

            DeviceTransfer dt = _context.DeviceTransfers.Where(dt => dt.Device == device && dt.DateOfRemoval == null).FirstOrDefault();
            dt.DateOfRemoval = DateTime.UtcNow;
            _context.DeviceTransfers.Update(dt);

            DeviceTransfer t = new DeviceTransfer
                {
                    DateOfInstallation = DateTime.UtcNow,
                    Device = device,
                    Workstation = workstation,
                    UseType = "рабочее место"
                };

            _context.DeviceTransfers.Add(t);
        }

        _context.Workstations.Update(workstation);
        _context.SaveChanges();
    }

    public void Delete(string id)
    {
        Workstation workstation = _context.Workstations.Where(w => w.RegisterNumber == id && w.IsDisassembled == false).SingleOrDefault();
        workstation.IsDisassembled = true;

            if (_context.DeviceTransfers.Any(x => x.IdWorkstation == workstation.Id && x.DateOfRemoval == null))
                throw new AppException("Для удаления рабочего места следует освободить набор устройств");

        WorkstationTransfer wt =  _context.WorkstationTransfers.Where(wt => wt.DateOfRemoval == null && wt.IdWorkstation == workstation.Id).SingleOrDefault();
        wt.DateOfRemoval = DateTime.UtcNow;

        _context.WorkstationTransfers.Update(wt);
        _context.Workstations.Update(workstation);

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