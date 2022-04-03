namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Devices;
using WebApi.Models.Locations;

public interface IDeviceService
{
    IEnumerable<Device> GetAll();
    Device GetById(int id);
    void Create(DeviceRequest model);
    void Update(int id, DeviceRequest model);
    void Delete(int id);
}

public class DeviceService : IDeviceService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public DeviceService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<Device> GetAll()
    {
        return _context.Devices.Include(d => d.Transfers.Where(t => t.DateOfRemoval == null)).ThenInclude(t => t.Workstation);
    }

    public Device GetById(int id)
    {
        return getDevice(id);
    }

    public void Create(DeviceRequest model)
    {
        // validate
        if (_context.Devices.Any(x => x.InventoryNumber == model.InventoryNumber))
            throw new AppException("Инвентарный № уже занят");



        Location location;
        if (model.IsReserve || model.IsCommonUse)
            location = _context.Locations.Where(l => l.Id == model.Location).FirstOrDefault();
        else
            location = _context.Locations.Include(l => l.Workstations).Where(w => w.Id == model.Location).FirstOrDefault();

        DeviceType deviceType = _context.DeviceTypes.Where(l => l.Id == model.DeviceType).FirstOrDefault();

        int countModel = _context.DeviceModels.Where(dm => dm.Name == model.DeviceModel).Count();

        DeviceModel deviceModel = new DeviceModel();
        if (countModel > 0) deviceModel = _context.DeviceModels.Where(dm => dm.Name == model.DeviceModel).FirstOrDefault();
        else
        {
            deviceModel = new DeviceModel
            {
                Name = model.DeviceModel,
                DeviceType = deviceType,
            };
        }

        Device device = new Device
        {
            InventoryNumber = model.InventoryNumber,
            SerialNumber = model.SerialNumber,
            Location = location,
            DeviceModel = deviceModel,
        };
        // save Location
        _context.Devices.Add(device);

        if(model.IsReserve || model.IsCommonUse)
        {
            Transfer transfer = new Transfer
            {
                DateOfInstallation = DateTime.UtcNow,
                Device = device,
                IdWorkstation = model.Location,
                
            };

            device.Transfers = new List<Transfer>();
            device.Transfers.Add(transfer);
        }

        _context.SaveChanges();
    }

    public void Update(int id, DeviceRequest model)
    {
        var Device = getDevice(id);

        // validate
        if (Device.InventoryNumber != model.InventoryNumber)
            if (_context.Devices.Any(x => x.InventoryNumber == model.InventoryNumber))
                throw new AppException("Инвентарный № уже занят");

  




        _context.Devices.Update(Device);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var Device = getDevice(id);
        _context.Devices.Remove(Device);
        _context.SaveChanges();
    }

    // helper methods

    private Device getDevice(int id)
    {
        var Device = _context.Devices.Find(id);
        if (Device == null) throw new KeyNotFoundException("Устройство не найдено");
        return Device;
    }

}