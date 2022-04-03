namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Locations;

public interface IDeviceTypeService
{
    IEnumerable<DeviceType> GetAll();
    IEnumerable<Location> GetAllDetails();
    DeviceType GetById(int id);
    void Create(DeviceType model);
    void Update(int id, DeviceType model);
    void Delete(int id);
}

public class DeviceTypeService : IDeviceTypeService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public DeviceTypeService(
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
        return _context.DeviceTypes.Include(dt => dt.DeviceModels).ThenInclude(dm => dm.Devices);
    }

    public IEnumerable<Location> GetAllDetails()
    {
        return _context.Locations.Include(l => l.Devices).ThenInclude(d => d.DeviceModel).ThenInclude(dm => dm.DeviceProperties).ThenInclude(dp => dp.DeviceParameter)
            .Include(l => l.Devices).ThenInclude(d => d.Transfers.Where(t => t.DateOfRemoval == null)).ThenInclude(t => t.Workstation);
    }

    public DeviceType GetById(int id)
    {
        return getDeviceType(id);
    }

    public void Create(DeviceType model)
    {
        // validate
        if (_context.DeviceTypes.Any(x => x.Name == model.Name))
            throw new AppException("Наименование вида устройства уже занято");

        var deviceType = _mapper.Map<DeviceType>(model);

        // save Location
        _context.DeviceTypes.Add(deviceType);
        _context.SaveChanges();
    }

    public void Update(int id, DeviceType model)
    {
        var deviceType = getDeviceType(id);

        // validate
        if (deviceType.Name != model.Name)
        if (_context.DeviceTypes.Any(x => x.Name == model.Name))
            throw new AppException("Наименование вида устройства уже занято");

        deviceType.Name = model.Name;
        deviceType.MinimalQuantity = model.MinimalQuantity;

        _context.DeviceTypes.Update(deviceType);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var deviceType = getDeviceType(id);
        _context.DeviceTypes.Remove(deviceType);
        _context.SaveChanges();
    }

    // helper methods

    private DeviceType getDeviceType(int id)
    {
        var deviceType = _context.DeviceTypes.Find(id);
        if (deviceType == null) throw new KeyNotFoundException("Вид устройства не найден");
        return deviceType;
    }

}