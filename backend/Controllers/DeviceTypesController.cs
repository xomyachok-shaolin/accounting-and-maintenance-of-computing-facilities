namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Locations;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class DeviceTypesController : ControllerBase
{
    private IDeviceTypeService _deviceTypeService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public DeviceTypesController(
        IDeviceTypeService deviceTypeService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _deviceTypeService = deviceTypeService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [HttpPost("create")]
    public ActionResult<DeviceType> Create(DeviceType model)
    {
        _deviceTypeService.Create(model);
        return Ok(new { message = "Создание вида устройства успешно выполнено" });
    }

    // [Authorize(Location.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var deviceTypes = _deviceTypeService.GetAll();


       /* foreach (var deviceType in deviceTypes)
            deviceType.CurrentQuantity = deviceTypes.Count(dt => dt.Name.Contains(deviceType.Name));*/

        return Ok(deviceTypes);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var deviceType = _deviceTypeService.GetById(id);
        return Ok(deviceType);
    }

    [HttpPut("{id}")]
    public ActionResult<DeviceType> Update(int id, DeviceType model)
    {
        _deviceTypeService.Update(id, model);        
        return Ok(new { message = "Информация о виде устройства успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _deviceTypeService.Delete(id);
        return Ok(new { message = "Информация о виде утсройства успешно удалена" });
    }
}