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
public class LocationsController : ControllerBase
{
    private ILocationService _locationService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public LocationsController(
        ILocationService LocationService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _locationService = LocationService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [AllowAnonymous]
    [HttpPost("create")]
    public ActionResult<Location> Create(WorkstationRequest model)
    {
        _locationService.Create(model);
        return Ok(new { message = "Создание местоположения успешно выполнено" });
    }

    // [Authorize(Location.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var locations = _locationService.GetAll();


        return Ok(locations);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var location = _locationService.GetById(id);
        return Ok(location);
    }

    [HttpPut("{id}")]
    public ActionResult<Location> Update(int id, WorkstationRequest model)
    {
        _locationService.Update(id, model);        
        return Ok(new { message = "Информация о местоположении успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _locationService.Delete(id);
        return Ok(new { message = "Информация о местоположении успешно удалена" });
    }
}