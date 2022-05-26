namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Devices;

public interface IDeviceParameterService
{
    IEnumerable<DeviceParameter> GetAll();
    DeviceParameter GetById(int id);
    void Create(DeviceParameter model);
    void createDeviceParameter(DeviceParameterRequest model);
    void Update(int id, DeviceParameter model);
    void UpdateDeviceParameter(int id, DeviceParameterRequest model);
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

        _context.DeviceParameters.Add(deviceParameter);
        _context.SaveChanges();
    }

    public void createDeviceParameter(DeviceParameterRequest model)
    {
        // validate
        if (_context.DeviceParameterValues.Any(x => x.DeviceId == model.Device && x.DeviceParameterId == model.DeviceParameter))
            throw new AppException("Значение параметра устройства уже занято");

        Device device = _context.Devices.Where(d => d.Id == model.Device).FirstOrDefault();
        DeviceParameter deviceParameter = _context.DeviceParameters.Where(dp => dp.Id == model.DeviceParameter).FirstOrDefault();

        DeviceParameterValue deviceParameterValue = new DeviceParameterValue()
        {
            Value = model.DeviceParameterValue,
            Device = device,
            DeviceParameter = deviceParameter
        };

        _context.DeviceParameterValues.Add(deviceParameterValue);
        _context.SaveChanges();
    }

    public void UpdateDeviceParameter(int id, DeviceParameterRequest model)
    {
        var deviceParameter = _context.DeviceParameterValues
            .Where(dp => dp.DeviceParameterId == model.DeviceParameter && dp.DeviceId == model.Device).FirstOrDefault();

        // validate
        if (deviceParameter.DeviceParameterId != model.DeviceParameter && deviceParameter.DeviceId != model.Device)
            if (_context.DeviceParameterValues.Any(x => x.DeviceId == model.Device && x.DeviceParameterId == model.DeviceParameter))
                throw new AppException("Значение параметра устройства уже занято");

        Device device = _context.Devices.Where(d => d.Id == model.Device).FirstOrDefault();
        DeviceParameter dp = _context.DeviceParameters.Where(dp => dp.Id == model.DeviceParameter).FirstOrDefault();


        deviceParameter.Device = device;
        deviceParameter.DeviceParameter = dp;
        deviceParameter.Value = model.DeviceParameterValue;

        _context.DeviceParameterValues.Update(deviceParameter);
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
        if (deviceParameter == null) throw new KeyNotFoundException("Параметр устройства не найден");
        return deviceParameter;
    }

}