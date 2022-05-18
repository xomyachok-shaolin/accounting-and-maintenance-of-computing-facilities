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
public class RolesController : ControllerBase
{
    private IRoleService _roleService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public RolesController(
        IRoleService roleService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _roleService = roleService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [HttpPost("create")]
    public ActionResult<Role> Create(Role model)
    {
        _roleService.Create(model);
        return Ok(new { message = "Создание роли успешно выполнено" });
    }

    // [Authorize(Role.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var roles = _roleService.GetAll();

   
        return Ok(roles);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _roleService.GetById(id);
        return Ok(user);
    }

    [HttpPut("{id}")]
    public ActionResult<Role> Update(int id, Role model)
    {
        _roleService.Update(id, model);
        return Ok(new { message = "Информация о роли успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _roleService.Delete(id);
        return Ok(new { message = "Информация о роли успешно удалена" });
    }
}