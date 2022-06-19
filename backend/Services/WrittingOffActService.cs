namespace WebApi.Services;

using AutoMapper;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using WebApi.Authorization;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.WrittingOffActs;

public interface IWrittingOffActService
{
    IEnumerable<WrittingOffAct> GetAll();
    WrittingOffAct GetById(int id);
    void Create(WrittingOffActRequest model);
    void Update(int id, WrittingOffActRequest model);
    void Delete(int id);
}

public class WrittingOffActService : IWrittingOffActService
{
    private DataContext _context;
    private IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;

    public WrittingOffActService(
        DataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
    }

    public IEnumerable<WrittingOffAct> GetAll()
    {
        return _context.WrittingOffActs
            .Include(wa => wa.WrittingOffActFiles)
            .Include(wa => wa.Devices)
                .ThenInclude(d => d.DeviceModel)
                    .ThenInclude(dm => dm.DeviceType).AsNoTracking().ToList();
    }

    public WrittingOffAct GetById(int id)
    {
        return getWrittingOffAct(id);
    }

    public void Create(WrittingOffActRequest model)
    {
        // validate
        if (_context.WrittingOffActs.Any(x => x.Name == model.Name))
            throw new AppException("Наименование '" + model.Name + "' уже занято");


        List<WrittingOffActFile> files = new List<WrittingOffActFile>();
        if (model.Files != null)
            foreach (var f in model.Files)
            {
                WrittingOffActFile waf = new WrittingOffActFile
                {
                    FileName = f.FileName,
                    File = f.Base64,
                };
                _context.WrittingOffActFiles.Add(waf);
                files.Add(waf);
            }

        List<Device> devices = new List<Device>();

        if (model.DecommissionedDevices != null)
            foreach (string device in model.DecommissionedDevices)
            {
                devices.Add(_context.Devices.Where(d => d.InventoryNumber == device).FirstOrDefault());

                DeviceTransfer dt = _context.DeviceTransfers.Where(dt => dt.DateOfRemoval == null)
                    .Include(dt => dt.Device).Where(d => d.Device.InventoryNumber == device).SingleOrDefault();
                dt.DateOfRemoval = DateTime.UtcNow;
                _context.DeviceTransfers.Update(dt);
            }

        WrittingOffAct wa = new WrittingOffAct
        {
            Name = model.Name,
            DateOfDebit = model.DateOfDebit,
            WrittingOffActFiles = files,
            Devices = devices
        };

        // save user
        _context.WrittingOffActs.Add(wa);
        _context.SaveChanges();
    }

    public void Update(int id, WrittingOffActRequest model)
    {
        var wa = getWrittingOffAct(id);
        
        // validate
        if (model.Name != wa.Name && _context.WrittingOffActs.Any(x => x.Name == model.Name))
            throw new AppException("Наименование '" + model.Name + "' уже занято");


        List<WrittingOffActFile> files = new List<WrittingOffActFile>();
        if (model.Files != null)
            foreach (var f in model.Files)
            {
                WrittingOffActFile waf = new WrittingOffActFile
                {
                    FileName = f.FileName,
                    File = f.Base64,
                };
                _context.WrittingOffActFiles.Add(waf);
                files.Add(waf);
            }

        wa.Name = model.Name;
        wa.DateOfDebit = model.DateOfDebit;
        wa.WrittingOffActFiles = files;

        _context.WrittingOffActs.Update(wa);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var wa = getWrittingOffAct(id);
        _context.WrittingOffActs.Remove(wa);
        _context.SaveChanges();
    }

    // helper methods

    private WrittingOffAct getWrittingOffAct(int id)
    {
        var wa = _context.WrittingOffActs.FirstOrDefault(u => u.Id == id); ; 
        if (wa == null) throw new KeyNotFoundException("Акт списания не найден");
        return wa;
    }

}