namespace WebApi.Services;

using AutoMapper;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Users;

public interface IUserService
{
    AuthenticateResponse Authenticate(AuthenticateRequest model);
    IEnumerable<User> GetAll();
    User GetById(int id);
    void Register(RegisterRequest model);
    void Update(int id, UpdateRequest model);
    void Delete(int id);
}

public class UserService : IUserService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public UserService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public AuthenticateResponse Authenticate(AuthenticateRequest model)
    {
        var user = _context.Users.SingleOrDefault(x => x.Username == model.Username);

        // validate
        if (user == null || !BCrypt.Verify(model.Password, user.PasswordHash))
            throw new AppException("Вы ввели неверное имя пользователя или неверный пароль");

        // authentication successful
        var response = _mapper.Map<AuthenticateResponse>(user);
        response.Token = _jwtUtils.GenerateToken(user);
        //response.Roles = 
        foreach (Role r in GetById(user.Id).Roles)
            response.Roles.Add(r);
        return response;
    }

    public IEnumerable<User> GetAll()
    {
        return _context.Users
            .Include(ur => ur.Roles).AsNoTracking().ToList();
    }

    public User GetById(int id)
    {
        return getUser(id);
    }

    public void Register(RegisterRequest model)
    {
        // validate
        if (_context.Users.Any(x => x.Username == model.Username))
            throw new AppException("Имя пользователя '" + model.Username + "' уже занято");


        List<Role> roles = new List<Role>();
        
        if (model.Roles != null)
        foreach (int r in model.Roles)
            roles.Add(_context.Roles.Where(role => role.Id == r).FirstOrDefault());


            // map model to new user object
            //var user = _mapper.Map<User>(model);
            User user = new User
        {
            Username = model.Username,
            FirstName = model.FirstName,
            LastName = model.LastName,
            Patronymic = model.Patronymic,
            Mail = model.Mail,
            PasswordHash = BCrypt.HashPassword(model.Password),
            Roles = roles
        };

        // save user
        _context.Users.Add(user);
        _context.SaveChanges();
    }

    public void Update(int id, UpdateRequest model)
    {
        var user = getUser(id);

        // validate
        if (model.Username != user.Username && _context.Users.Any(x => x.Username == model.Username))
            throw new AppException("Имя пользователя '" + model.Username + "' уже занято");

        // hash password if it was entered
        if (!string.IsNullOrEmpty(model.Password))
            user.PasswordHash = BCrypt.HashPassword(model.Password);

        List<Role> roles = new List<Role>();
        if (model.Roles != null)
            foreach (int r in model.Roles)
                roles.Add(_context.Roles.Where(role => role.Id == r).FirstOrDefault());

        // copy model to user and save
        // _mapper.Map(model, user);
        user.FirstName = model.FirstName;
        user.LastName = model.LastName; 
        user.Username = model.Username; 
        user.Mail = model.Mail;
        user.Mail = user.Mail;
        user.Patronymic = model.Patronymic;
        user.Roles = roles;

        _context.Users.Update(user);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var user = getUser(id);
        _context.Users.Remove(user);
        _context.SaveChanges();
    }

    // helper methods

    private User getUser(int id)
    {
        var user = _context.Users.Include(ur => ur.Roles).FirstOrDefault(u => u.Id == id); ; 
        if (user == null) throw new KeyNotFoundException("Пользователь не найден");
        return user;
    }

}