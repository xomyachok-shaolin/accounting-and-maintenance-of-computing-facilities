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
public class DeviceDetailsController : ControllerBase
{
    private IDeviceTypeService _deviceTypeService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public DeviceDetailsController(
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

    // [Authorize(Location.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var devices = _deviceTypeService.GetAllDetails();


        return Ok(devices);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var deviceType = _deviceTypeService.GetById(id);
        return Ok(deviceType);
    }

   
}