namespace WebApi.Services;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Locations;

public interface ILocationService
{
    IEnumerable<Location> GetAll();
    Location GetById(int id);
    void Create(LocationRequest model);
    void Update(int id, LocationRequest model);
    void Delete(int id);
}

public class LocationService : ILocationService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public LocationService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<Location> GetAll()
    {
        return _context.Locations
            .Include(l => l.Employee); ;
    }

    public Location GetById(int id)
    {
        return getLocation(id);
    }

    public void Create(LocationRequest model)
    {
        // validate
        if (_context.Locations.Any(x => x.Room == model.Room) 
            && _context.Locations.Any(x => x.House == model.House))
            throw new AppException("Местоположение уже занято");

        // map model to new Location object
        var Location = _mapper.Map<Location>(model);


        // save Location
        _context.Locations.Add(Location);
        _context.SaveChanges();
    }

    public void Update(int id, LocationRequest model)
    {
        var Location = getLocation(id);

        // validate
        if (_context.Locations.Any(x => x.Room == model.Room)
                   && _context.Locations.Any(x => x.House == model.House))
            throw new AppException("Местоположение уже занято");


        //_mapper.Map(model, Location);
        Location.House = model.House;
        Location.Room = model.Room;

        _context.Locations.Update(Location);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var Location = getLocation(id);
        _context.Locations.Remove(Location);
        _context.SaveChanges();
    }

    // helper methods

    private Location getLocation(int id)
    {
        var Location = _context.Locations.Find(id);
        if (Location == null) throw new KeyNotFoundException("Роль не найдена");
        return Location;
    }

}