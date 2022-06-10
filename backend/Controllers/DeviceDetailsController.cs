namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Devices;
using WebApi.Models.Locations;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class DeviceDetailsController : ControllerBase
{
    private IDeviceTypeService _deviceTypeService;
    private IDeviceService _deviceService;
    private IWorkstationService _workstationService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public DeviceDetailsController(
        IDeviceTypeService deviceTypeService,
        IDeviceService deviceService,
        IWorkstationService workstationService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _deviceTypeService = deviceTypeService;
        _deviceService = deviceService;
        _workstationService = workstationService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    public IActionResult GetAll()
    {
        var devices = _deviceService.GetAll();

        return Ok(devices);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var deviceType = _deviceTypeService.GetById(id);
        return Ok(deviceType);
    }

    [HttpPost("create")]
    public async Task<ActionResult<DeviceRequest>> Create(DeviceRequest model)
    {

        _deviceService.Create(model);

        return Ok(new { message = "Устройство успешно добавлено" });
    }

    [HttpPut("{id}")]
    public ActionResult<DeviceRequest> Update(int id, DeviceRequest model)
    {
        _deviceService.Update(id, model);
        return Ok(new { message = "Информация об устройстве успешно обновлена" });
    }


    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _deviceService.Delete(id);
        return Ok(new { message = "Информация об устройстве успешно удалена" });
    }

}