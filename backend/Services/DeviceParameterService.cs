namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;

public interface IDeviceParameterService
{
    IEnumerable<DeviceParameter> GetAll();
    DeviceParameter GetById(int id);
    void Create(DeviceParameter model);
    void Update(int id, DeviceParameter model);
    void Delete(int id);
}

public class DeviceParameterService : IDeviceParameterService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public DeviceParameterService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<DeviceParameter> GetAll()
    {
        return _context.DeviceParameters;
    }

    public DeviceParameter GetById(int id)
    {
        return getDeviceParameter(id);
    }

    public void Create(DeviceParameter model)
    {
        // validate
        if (_context.DeviceParameters.Any(x => x.Name == model.Name))
            throw new AppException("Наименование характеристики устройства уже занято");

        var deviceParameter = _mapper.Map<DeviceParameter>(model);

        // save Location
        _context.DeviceParameters.Add(deviceParameter);
        _context.SaveChanges();
    }

    public void Update(int id, DeviceParameter model)
    {
        var deviceParameter = getDeviceParameter(id);

        // validate
        if (deviceParameter.Name != model.Name)
        if (_context.DeviceParameters.Any(x => x.Name == model.Name))
            throw new AppException("Наименование характеристики устройства уже занято");

        deviceParameter.Name = model.Name;

        _context.DeviceParameters.Update(deviceParameter);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var deviceParameter = getDeviceParameter(id);
        _context.DeviceParameters.Remove(deviceParameter);
        _context.SaveChanges();
    }

    // helper methods

    private DeviceParameter getDeviceParameter(int id)
    {
        var deviceParameter = _context.DeviceParameters.Find(id);
        if (deviceParameter == null) throw new KeyNotFoundException("Характеристика устройства не найдена");
        return deviceParameter;
    }

}