namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class EmployeesController : ControllerBase
{
    private IEmployeeService _employeeService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public EmployeesController(
        IEmployeeService employeeService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _employeeService = employeeService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    // [Authorize(Role.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var roles = _employeeService.GetAll();

   
        return Ok(roles);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _employeeService.GetById(id);
        return Ok(user);
    }

}