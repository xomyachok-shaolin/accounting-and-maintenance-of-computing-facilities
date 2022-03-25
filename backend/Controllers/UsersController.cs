namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Users;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private IUserService _userService;
    private IRoleService _roleService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UsersController(
        IUserService userService,
        IRoleService roleService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _userService = userService;
        _roleService = roleService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public IActionResult Authenticate(AuthenticateRequest model)
    {
        var response = _userService.Authenticate(model);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<RegisterRequest>> Register(RegisterRequest model)
    {
        model.ImageName = await SaveImage(model.ImageFile, model.ImageName);

        User user = _userService.Register(model);
        if (model.Roles.Length != 0)
        {
            if (user.Roles != null) user.Roles.Clear();
            else user.Roles = new List<Role>(); 

            foreach (int r in model.Roles)
                user.Roles.Add(_roleService.GetById(r));
        }

        return Ok(new { message = "Регистрация успешно выполнена" });
    }

    // [Authorize(Role.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var users = _userService.GetAll();

        foreach (var user in users)
        {
            user.ImageFile = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.ImageName);
        }

        return Ok(users);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var user = _userService.GetById(id);
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UpdateRequest>>Update(int id, UpdateRequest model)
    {
        if (!(model.ImageFile.Equals("null") && model.ImageName.Equals("null")))
            model.ImageName = await SaveImage(model.ImageFile, model.ImageName);

        if (model.Roles.Length != 0)
        {
            if (_userService.GetById(id).Roles != null) _userService.GetById(id).Roles.Clear();
            else _userService.GetById(id).Roles = new List<Role>();
            foreach (int r in model.Roles)
                _userService.GetById(id).Roles.Add(_roleService.GetById(r));
        }

        _userService.Update(id, model);
        return Ok(new { message = "Информация о пользователе успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _userService.Delete(id);
        return Ok(new { message = "Информация о пользователе успешно удалена" });
    }

    [NonAction]
    public async Task<string> SaveImage(string img, string imgName)
    {
        if (img == "null" && imgName == "null") return "anonymous.png";

        byte[] bytes = Convert.FromBase64String(img.Substring(img.LastIndexOf(',') + 1));
        MemoryStream stream = new MemoryStream(bytes);
        IFormFile imageFile = new FormFile(stream, 0, bytes.Length, imgName, imgName);
        string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
        imageName += DateTime.Now.ToString("yymmssfff")+ Path.GetExtension(imageFile.FileName);
        var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath,"Images",imageName);
        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
            await imageFile.CopyToAsync(fileStream);
        }
        return imageName;
    }
}