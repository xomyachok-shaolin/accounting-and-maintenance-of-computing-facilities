namespace WebApi.Helpers;

using Microsoft.EntityFrameworkCore;
using WebApi.Entities;

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
            .HasMany(l => l.Workstations)
            .WithOne(w => w.Location)
            .HasForeignKey(w => w.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Location>()
            .HasMany(l => l.Devices)
            .WithOne(d => d.Location)
            .HasForeignKey(d => d.IdLocation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeviceType>()
            .HasMany(dt => dt.DeviceModels)
            .WithOne(dm => dm.DeviceType)
            .HasForeignKey(dt => dt.IdDeviceType)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeviceProperties>()
            .HasKey(dp => new { dp.DeviceParameterId , dp.DeviceModelId });

        modelBuilder.Entity<DeviceProperties>()
            .HasOne(pt => pt.DeviceModel)
            .WithMany(p => p.DeviceProperties)
            .HasForeignKey(pt => pt.DeviceModelId);

        modelBuilder.Entity<DeviceProperties>()
            .HasOne(pt => pt.DeviceParameter)
            .WithMany(t => t.DeviceProperties)
            .HasForeignKey(pt => pt.DeviceParameterId);

        modelBuilder.Entity<TaskType>()
            .HasMany(tt => tt.Tasks)
            .WithOne(t => t.TaskType)
            .HasForeignKey(tt => tt.IdTaskType)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Task>()
            .HasMany(t => t.Transfers)
            .WithOne(tr => tr.Task)
            .HasForeignKey(t => t.IdTask)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.Workstations)
            .WithOne(w => w.Employee)
            .HasForeignKey(w => w.IdEmployee)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Employee>()
            .HasMany(e => e.Locations)
            .WithOne(r => r.Employee)
            .HasForeignKey(r => r.IdEmployee)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Workstation>()
            .HasMany(w => w.Transfers)
            .WithOne(t => t.Workstation)
            .HasForeignKey(t => t.IdWorkstation)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Device>()
            .HasMany(d => d.Transfers)
            .WithOne(t => t.Device)
            .HasForeignKey(t => t.IdDevice)
            .OnDelete(DeleteBehavior.Restrict);

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Location> Locations { get; set; }

    public DbSet<DeviceType> DeviceTypes { get; set; }
    public DbSet<DeviceParameter> DeviceParameters { get; set; }
    public DbSet<DeviceModel> DeviceModels { get; set; }
    public DbSet<DeviceProperties> DeviceProperties { get; set; }
    public DbSet<Device> Devices { get; set; }

    public DbSet<TaskType> TaskTypes { get; set; }
    public DbSet<Task> Tasks { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Workstation> Workstations { get; set; }
    public DbSet<Transfer> Transfers { get; set; }
}