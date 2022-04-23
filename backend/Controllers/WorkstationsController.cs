namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Workstations;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class WorkstationsController : ControllerBase
{
    private IWorkstationService _workstationService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public WorkstationsController(
        IWorkstationService WorkstationService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _workstationService = WorkstationService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }
    
    [AllowAnonymous]
    [HttpPost("create")]
    public ActionResult<Workstation> Create(WorkstationRequest model)
    {
        _workstationService.Create(model);
        return Ok(new { message = "Создание рабочего места успешно выполнено" });
    }

    // [Authorize(Workstation.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var workstations = _workstationService.GetAll();


        return Ok(workstations);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var workstation = _workstationService.GetById(id);
        return Ok(workstation);
    }

    [HttpPut("{id}")]
    public ActionResult<Workstation> Update(int id, WorkstationRequest model)
    {
        _workstationService.Update(id, model);        
        return Ok(new { message = "Информация о рабочем месте успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _workstationService.Delete(id);
        return Ok(new { message = "Информация о рабочем месте успешно удалена" });
    }
}