using BCryptNet = BCrypt.Net.BCrypt;

using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// add services to DI container
{
    var services = builder.Services;
    var env = builder.Environment;

    services.AddDbContext<DataContext>();

    services.AddCors();
    services.AddControllers();

    services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
    // configure automapper with all automapper profiles from this assembly
    services.AddAutoMapper(typeof(Program));

    // configure strongly typed settings object
    services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

    // configure DI for application services
    services.AddScoped<IJwtUtils, JwtUtils>();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IRoleService, RoleService>();
    services.AddScoped<ILocationService, LocationService>();
    services.AddScoped<IEmployeeService, EmployeeService>();
    services.AddScoped<IDeviceTypeService, DeviceTypeService>();
    services.AddScoped<IDeviceParameterService, DeviceParameterService>();

}

var app = builder.Build();

// migrate any database changes on startup (includes initial db creation)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<DataContext>();   
    if (context.Database.GetPendingMigrations().Any())
        context.Database.Migrate();

}


// configure HTTP request pipeline
{
    // global cors policy
    app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());

    // global error handler
    app.UseMiddleware<ErrorHandlerMiddleware>();

    // custom jwt auth middleware
    app.UseMiddleware<JwtMiddleware>();

    app.MapControllers();

}


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

// create hardcoded test users in db on startup
/*{
    var role1 = new Role { Name = "Администратор", IsEditWS = true, IsTransfer = true, IsUpgrade = true, IsWriteOff = true, IsEditTask = false };
    var role2 = new Role { Name = "Ответственный за списание", IsEditWS = true, IsTransfer = false, IsUpgrade = false, IsWriteOff = false, IsEditTask = false };

    var testUsers = new List<User>
    {
        new User { Id = 1, FirstName = "Admin", LastName = "Admin", Patronymic = "", 
            Mail = "admin", Username = "admin", PasswordHash = BCryptNet.HashPassword("admin"), ImageName ="0222003866.jpg", Roles = new List<Role>{ role1, role2 } },
        new User { Id = 2, FirstName = "User", LastName = "User", Patronymic = "", 
            Mail = "user@mail.ru", Username = "user", PasswordHash = BCryptNet.HashPassword("user"), ImageName ="0222003866.jpg", Roles =  new List<Role>{ role2 } }
    };
    using var scope = app.Services.CreateScope();
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    dataContext.Users.AddRange(testUsers);
    dataContext.SaveChanges();
}*/

app.Run();