﻿namespace WebApi.Controllers;

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
public class DeviceParametersController : ControllerBase
{
    private IDeviceParameterService _deviceParameterService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public DeviceParametersController(
        IDeviceParameterService deviceParameterService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _deviceParameterService = deviceParameterService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [AllowAnonymous]
    [HttpPost("create")]
    public ActionResult<DeviceParameter> Create(DeviceParameter model)
    {
        _deviceParameterService.Create(model);
        return Ok(new { message = "Создание параметра устройства успешно выполнено" });
    }

    // [Authorize(Location.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var deviceParameters = _deviceParameterService.GetAll();


        return Ok(deviceParameters);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var deviceParameter = _deviceParameterService.GetById(id);
        return Ok(deviceParameter);
    }

    [HttpPut("{id}")]
    public ActionResult<DeviceParameter> Update(int id, DeviceParameter model)
    {
        _deviceParameterService.Update(id, model);        
        return Ok(new { message = "Информация о параметре устройства успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _deviceParameterService.Delete(id);
        return Ok(new { message = "Информация о параметре устройства успешно удалена" });
    }
}