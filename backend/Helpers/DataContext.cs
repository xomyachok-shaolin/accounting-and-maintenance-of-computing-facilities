namespace WebApi.Helpers;

using Microsoft.EntityFrameworkCore;
using WebApi.Entities;
using WebApi.Models.DeviceTypes;
using WebApi.Models.WrittingOffActs;

public partial class DataContext : DbContext
{
    protected readonly IConfiguration Configuration;

    public DataContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // connect to sql server database
        options.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>().HasIndex(r => r.Name).IsUnique();
        
        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        // modelBuilder.Entity<User>().HasIndex(u => u.Mail).IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(u => u.Tasks)
            .WithOne(t => t.User)
            .HasForeignKey(t => t.IdUser)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasMany(l => l.TaskWorkstationTransfers)
            .WithOne(w => w.Location)
            .HasForeignKey(w => w.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasMany(l => l.TaskDeviceTransfers)
            .WithOne(w => w.Location)
            .HasForeignKey(w => w.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasMany(l => l.DeviceTransfers)
            .WithOne(w => w.Location)
            .HasForeignKey(w => w.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasMany(l => l.WorkstationTransfers)
            .WithOne(d => d.Location)
            .HasForeignKey(d => d.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeviceType>()
            .HasMany(dt => dt.DeviceModels)
            .WithOne(dm => dm.DeviceType)
            .HasForeignKey(dt => dt.IdDeviceType)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<DeviceParameterValue>()
            .HasKey(dp => new { dp.DeviceParameterId , dp.DeviceId });

        modelBuilder.Entity<DeviceParameterValue>()
            .HasOne(dpv => dpv.Device)
            .WithMany(p => p.DeviceParameterValues)
            .HasForeignKey(dpv => dpv.DeviceId);

        modelBuilder.Entity<DeviceParameterValue>()
            .HasOne(pt => pt.DeviceParameter)
            .WithMany(t => t.DeviceParameterValues)
            .HasForeignKey(pt => pt.DeviceParameterId);

        modelBuilder.Entity<TaskType>()
            .HasMany(tt => tt.Tasks)
            .WithOne(t => t.TaskType)
            .HasForeignKey(tt => tt.IdTaskType)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasMany(t => t.TaskDeviceTransfers)
            .WithOne(tr => tr.Task)
            .HasForeignKey(t => t.IdTask)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasMany(t => t.TaskWorkstationTransfers)
            .WithOne(tr => tr.Task)
            .HasForeignKey(t => t.IdTask)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.TaskWorkstationTransfers)
            .WithOne(w => w.Employee)
            .HasForeignKey(w => w.IdEmployee)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.WorkstationTransfers)
            .WithOne(w => w.Employee)
            .HasForeignKey(w => w.IdEmployee)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.Locations)
            .WithOne(r => r.Employee)
            .HasForeignKey(r => r.IdEmployee)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Workstation>()
            .HasMany(w => w.WorkstationTransfers)
            .WithOne(t => t.Workstation)
            .HasForeignKey(t => t.IdWorkstation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Workstation>()
            .HasMany(w => w.TaskWorkstationTransfers)
            .WithOne(t => t.Workstation)
            .HasForeignKey(t => t.IdWorkstation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Workstation>()
            .HasMany(w => w.DeviceTransfers)
            .WithOne(t => t.Workstation)
            .HasForeignKey(t => t.IdWorkstation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Workstation>()
            .HasMany(w => w.TaskDeviceTransfers)
            .WithOne(t => t.Workstation)
            .HasForeignKey(t => t.IdWorkstation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Device>()
            .HasMany(d => d.DeviceTransfers)
            .WithOne(t => t.Device)
            .HasForeignKey(t => t.IdDevice)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Device>()
            .HasMany(d => d.TaskDeviceTransfers)
            .WithOne(t => t.Device)
            .HasForeignKey(t => t.IdDevice)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeviceModel>()
            .HasMany(dm => dm.Devices)
            .WithOne(d => d.DeviceModel)
            .HasForeignKey(d => d.IdDeviceModel)
            .OnDelete(DeleteBehavior.Restrict);


        modelBuilder.Entity<WrittingOffAct>()
            .HasMany(w => w.WrittingOffActFiles)
            .WithOne(t => t.WrittingOffAct)
            .HasForeignKey(t => t.IdWrittingOffAct)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<WrittingOffAct>()
            .HasMany(w => w.Devices)
            .WithOne(d => d.WrittingOffAct)
            .HasForeignKey(d => d.IdWrittingOffAct)
            .OnDelete(DeleteBehavior.Restrict);

        // modelBuilder.Entity<TaskDeviceTransfer>().HasDiscriminator(dt => dt.UseType);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<DeviceType> DeviceTypes { get; set; }
    public DbSet<DeviceParameter> DeviceParameters { get; set; }
    public DbSet<DeviceModel> DeviceModels { get; set; }
    public DbSet<DeviceParameterValue> DeviceParameterValues { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<DeviceTransfer> DeviceTransfers { get; set; }


    public DbSet<TaskWorkstationTransfer> TaskWorkstationTransfers { get; set; }
    public DbSet<WorkstationTransfer> WorkstationTransfers { get; set; }
    public DbSet<TaskDeviceTransfer> TaskDeviceTransfers { get; set; }
    public DbSet<TaskType> TaskTypes { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Workstation> Workstations { get; set; }
    public DbSet<WrittingOffAct> WrittingOffActs { get; set; }
    public DbSet<WrittingOffActFile> WrittingOffActFiles { get; set; }

    public DbSet<DeviceTypeRequest> DeviceTypeRequests { get; set; }


}