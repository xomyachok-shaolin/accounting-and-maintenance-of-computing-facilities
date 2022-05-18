namespace WebApi.Controllers;

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Users;
using WebApi.Models.WrittingOffActs;
using WebApi.Services;

[Authorize]
[ApiController]
[Route("[controller]")]
public class WrittingOffActsController : ControllerBase
{
    private IWrittingOffActService _writtingOffActService;
    private IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public WrittingOffActsController(
        IWrittingOffActService writtingOffActService,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
        _writtingOffActService = writtingOffActService;
        _mapper = mapper;
        _appSettings = appSettings.Value;
    }
    
    [AllowAnonymous]
    [HttpPost("create")]
    public async Task<ActionResult<WrittingOffActRequest>> create(WrittingOffActRequest model)
    {
        if(model.Files != null)
        foreach (var file in model.Files)
        {
            file.FileName = await SaveFile(file.Base64, file.FileName);
        }

        _writtingOffActService.Create(model);
        
        return Ok(new { message = "Акт о списании успешно создан" });
    }

    // [Authorize(Role.Admin)]
    [HttpGet]
    public IActionResult GetAll()
    {
        var was = _writtingOffActService.GetAll();
        
        foreach (var wa in was)
        {
            foreach (var f in wa.WrittingOffActFiles)
            {
                f.File = String.Format("{0}://{1}{2}/Documents/{3}", Request.Scheme, Request.Host, Request.PathBase, f.FileName);
            }
        }

        return Ok(was);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var wa = _writtingOffActService.GetById(id);
        return Ok(wa);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UpdateRequest>>Update(int id, WrittingOffActRequest model)
    {

        foreach (var file in model.Files)
        {
            file.FileName = await SaveFile(file.Base64, file.FileName);
        }

        _writtingOffActService.Update(id, model);
        return Ok(new { message = "Информация об акте списания успешно обновлена" });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _writtingOffActService.Delete(id);
        return Ok(new { message = "Информация об акте списания успешно удалена" });
    }

    [NonAction]
    public async Task<string> SaveFile(string file, string fileName)
    {
        if (file == "null" && fileName == "null") return "";

        byte[] bytes = Convert.FromBase64String(file.Substring(file.LastIndexOf(',') + 1));
        MemoryStream stream = new MemoryStream(bytes);
        IFormFile IFile = new FormFile(stream, 0, bytes.Length, fileName, fileName);
        string imageName = new String(Path.GetFileNameWithoutExtension(IFile.FileName).Take(10).ToArray()).Replace(' ', '-');
        imageName += DateTime.Now.ToString("yymmssfff")+ Path.GetExtension(IFile.FileName);
        var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath,"Documents",imageName);
        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
            await IFile.CopyToAsync(fileStream);
        }
        return imageName;
    }
}