namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Helpers;
using WebApi.Models.Users;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    private IUserService _userService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public UsersController(
        IUserService userService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _userService = userService;
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
        _userService.Register(model);
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
    public IActionResult Update(int id, UpdateRequest model)
    {
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