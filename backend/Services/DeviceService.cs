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
    IEnumerable<DeviceType> GetAll();
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
    
    public IEnumerable<DeviceType> GetAll()
    {
        return _context.DeviceTypes
            .Include(dt => dt.DeviceModels)
                .ThenInclude(dm => dm.Devices)
                    .ThenInclude(d => d.DeviceTransfers)
                        .ThenInclude(dt => dt.Location)
            .Include(dt => dt.DeviceModels)
                .ThenInclude(dm => dm.Devices)
                    .ThenInclude(d => d.DeviceTransfers)
                        .ThenInclude(dt => dt.Workstation)
                            .ThenInclude(w => w.WorkstationTransfers)
                                .ThenInclude(wt => wt.Location)
            .Include(dt => dt.DeviceModels)
                    .ThenInclude(d => d.DeviceParameterValues)
                        .ThenInclude(dp => dp.DeviceParameter)
            .Include(dt => dt.DeviceModels)
                .ThenInclude(dm => dm.Devices)
                    .ThenInclude(d => d.WrittingOffAct);
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

        Location location = null;
        Workstation workstation = null;

        if (model.IsReserve || model.IsCommonUse)
            location = _context.Locations.Where(l => l.Id == model.Location).FirstOrDefault();
        else
            workstation = _context.Workstations.Where(w => w.Id == model.Location).FirstOrDefault();

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
            DeviceModel = deviceModel,
        };
        _context.Devices.Add(device);

        DeviceTransfer transfer = null;
        if (model.IsReserve || model.IsCommonUse) {
            transfer = new DeviceTransfer
            {
                DateOfInstallation = DateTime.UtcNow,
                Device = device,
                Location = location,
                UseType = model.IsReserve? "резерв" : "общее пользование"
            };
        } else {
            transfer = new DeviceTransfer
            {
                DateOfInstallation = DateTime.UtcNow,
                Device = device,
                Workstation = workstation,
                UseType = "рабочее место"
            };
        }
            
        device.DeviceTransfers = new List<DeviceTransfer>();
        device.DeviceTransfers.Add(transfer);

        _context.SaveChanges();
    }
    static void Swap<T>(ref T lhs, ref T rhs)
    {
        T temp;
        temp = lhs;
        lhs = rhs;
        rhs = temp;
    }
    public void Update(int id, DeviceRequest model)
    {
        var device = getDevice(id);

        // validate
        if (device.InventoryNumber != model.InventoryNumber)
            if (_context.Devices.Any(x => x.InventoryNumber == model.InventoryNumber))
                throw new AppException("Инвентарный № уже занят");

        DeviceModel deviceModel = _context.DeviceModels.Find(device.IdDeviceModel);

        DeviceType deviceType;
        if (model.DeviceType == -1)
            deviceType = _context.DeviceTypes.Find(deviceModel.IdDeviceType);
        else
            deviceType = _context.DeviceTypes.Where(l => l.Id == model.DeviceType).FirstOrDefault();

        if (model.DeviceModel != deviceModel.Name)
        {
            int countDevicesModel = _context.Devices.Where(d => d.DeviceModel.Name == device.DeviceModel.Name &&
                d.DeviceModel.DeviceType.Id == device.DeviceModel.IdDeviceType).Count();
            if (countDevicesModel == 1)
            {
                DeviceModel deviceModel1 = _context.DeviceModels.Where(d => d.Name == model.DeviceModel &&
                    d.DeviceType.Id == deviceType.Id).FirstOrDefault();

                if (deviceModel1 == null)
                {
                    deviceModel.DeviceType = deviceType;
                    deviceModel.Name = model.DeviceModel;
                    _context.DeviceModels.Update(deviceModel);
                } else
                {
                    Swap<DeviceModel>(ref deviceModel, ref deviceModel1);
                    device.DeviceModel = deviceModel;
                    _context.DeviceModels.Remove(deviceModel1);
                }
                
            }

        } else {
            int countDevicesModel = _context.Devices.Where(d => d.DeviceModel.Name == device.DeviceModel.Name &&
                    d.DeviceModel.DeviceType.Id == device.DeviceModel.IdDeviceType).Count();
            if (countDevicesModel == 1)
            {
                DeviceModel deviceModel1 = _context.DeviceModels.Where(d => d.Name == model.DeviceModel &&
                    d.DeviceType.Id == deviceType.Id).FirstOrDefault();
                if (deviceModel1 == null)
                {
                    deviceModel.DeviceType = deviceType;
                    deviceModel.Name = model.DeviceModel;
                    _context.DeviceModels.Update(deviceModel);
                } else {
                    if (deviceModel != deviceModel1)
                    {
                        Swap<DeviceModel>(ref deviceModel, ref deviceModel1);
                        device.DeviceModel = deviceModel;
                        deviceModel1.Devices = null;
                        _context.DeviceModels.Remove(deviceModel1);
                    }
                }
            } else {
                    deviceModel = new DeviceModel
                    {
                        Name = model.DeviceModel,
                        DeviceType = deviceType,
                    };
                    _context.DeviceModels.Add(deviceModel);
                
            }
        }

        device.InventoryNumber = model.InventoryNumber;
        device.DeviceModel = deviceModel;

        _context.Devices.Update(device);

        


        Location location = null;
        Workstation workstation = null;

        if (model.Location != -1)
        {
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
            } else {
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