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
    void DeleteDeviceParameter(DeviceParameterDeleteRequest model);

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
        DeviceType dt = _context.DeviceTypes.Where(dt => dt.Name == model.DeviceType).FirstOrDefault();

        DeviceModel deviceModel = _context.DeviceModels.Where(dm => dm.Name == model.DeviceModel && dm.IdDeviceType == dt.Id).SingleOrDefault();

        if (deviceModel == null)
            throw new AppException("Наименование модели \""+ model.DeviceModel + "\" для \"" + dt.Name + "\" не найдено");

        if (_context.DeviceParameterValues.Any(x => x.DeviceModelId == deviceModel.Id && x.DeviceParameterId == model.DeviceParameter))
            throw new AppException("Значение параметра  \"" + deviceModel.Name + "\"  уже занято");

        DeviceParameter deviceParameter = _context.DeviceParameters.Where(dp => dp.Id == model.DeviceParameter).FirstOrDefault();

        DeviceParameterValue deviceParameterValue = new DeviceParameterValue()
        {
            Value = model.DeviceParameterValue,
            DeviceModel = deviceModel,
            DeviceParameter = deviceParameter
        };

        _context.DeviceParameterValues.Add(deviceParameterValue);
        _context.SaveChanges();
    }

    public void UpdateDeviceParameter(int id, DeviceParameterRequest model)
    {

        DeviceType dt = _context.DeviceTypes.Where(dt => dt.Name  == model.DeviceType).FirstOrDefault();

        DeviceModel deviceModel = _context.DeviceModels.Where(dm => dm.Name == model.DeviceModel && dm.IdDeviceType == dt.Id).SingleOrDefault();

        if (deviceModel == null)
            throw new AppException("Наименование модели \"" + model.DeviceModel + "\" для \"" + dt.Name + "\" не найдено");

        var deviceParameter = _context.DeviceParameterValues
            .Where(dp => dp.DeviceParameterId == model.DeviceParameter && dp.DeviceModelId == deviceModel.Id).FirstOrDefault();

        // validate
        if (deviceParameter.DeviceParameterId != model.DeviceParameter && deviceParameter.DeviceModelId != deviceModel.Id)
            if (_context.DeviceParameterValues.Any(x => x.DeviceModelId == deviceModel.Id && x.DeviceParameterId == model.DeviceParameter))
                throw new AppException("Значение параметра  \"" + deviceModel.Name + "\"  уже занято");

        DeviceParameter dp = _context.DeviceParameters.Where(dp => dp.Id == model.DeviceParameter).FirstOrDefault();


        deviceParameter.DeviceModel = deviceModel;
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
            throw new AppException("Наименование параметра устройства уже занято");

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

    public void DeleteDeviceParameter(DeviceParameterDeleteRequest model)
    {
        DeviceParameter temp = _context.DeviceParameters.Where(dp => dp.Name == model.DeviceParameter).FirstOrDefault();

        var deviceParameter = _context.DeviceParameterValues.Where(dp => dp.DeviceParameterId == temp.Id && dp.DeviceModelId == model.DeviceModel).FirstOrDefault();
        _context.DeviceParameterValues.Remove(deviceParameter);
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