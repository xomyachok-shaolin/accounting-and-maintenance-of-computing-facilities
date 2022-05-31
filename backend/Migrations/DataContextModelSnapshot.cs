﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using WebApi.Helpers;

#nullable disable

namespace WebApi.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.Property<int>("RolesId")
                        .HasColumnType("integer");

                    b.Property<int>("UsersId")
                        .HasColumnType("integer");

                    b.HasKey("RolesId", "UsersId");

                    b.HasIndex("UsersId");

                    b.ToTable("RoleUser");
                });

            modelBuilder.Entity("WebApi.Entities.Device", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime?>("DateOfLastService")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("DateOfNextService")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("DeviceParameterId")
                        .HasColumnType("integer");

                    b.Property<int>("IdDeviceModel")
                        .HasColumnType("integer");

                    b.Property<int?>("IdWrittingOffAct")
                        .HasColumnType("integer");

                    b.Property<string>("InventoryNumber")
                        .HasColumnType("text");

                    b.Property<bool?>("IsDeleted")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.HasKey("Id");

                    b.HasIndex("DeviceParameterId");

                    b.HasIndex("IdDeviceModel");

                    b.HasIndex("IdWrittingOffAct");

                    b.ToTable("Devices");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceModel", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("IdDeviceType")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("IdDeviceType");

                    b.ToTable("DeviceModels");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceParameter", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("DeviceModelId")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("DeviceModelId");

                    b.ToTable("DeviceParameters");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceParameterValue", b =>
                {
                    b.Property<int>("DeviceParameterId")
                        .HasColumnType("integer");

                    b.Property<int>("DeviceModelId")
                        .HasColumnType("integer");

                    b.Property<string>("Value")
                        .HasColumnType("text");

                    b.HasKey("DeviceParameterId", "DeviceModelId");

                    b.HasIndex("DeviceModelId");

                    b.ToTable("DeviceParameterValues");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceTransfer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfInstallation")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("DateOfRemoval")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("IdDevice")
                        .HasColumnType("integer");

                    b.Property<int?>("IdLocation")
                        .HasColumnType("integer");

                    b.Property<int?>("IdWorkstation")
                        .HasColumnType("integer");

                    b.Property<string>("UseType")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("IdDevice");

                    b.HasIndex("IdLocation");

                    b.HasIndex("IdWorkstation");

                    b.ToTable("DeviceTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("MinimalQuantity")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("DeviceTypes");
                });

            modelBuilder.Entity("WebApi.Entities.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Department")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("Patronymic")
                        .HasColumnType("text");

                    b.Property<string>("PersonnelNumber")
                        .HasColumnType("text");

                    b.Property<string>("Position")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("WebApi.Entities.Location", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("House")
                        .HasColumnType("text");

                    b.Property<int?>("IdEmployee")
                        .HasColumnType("integer");

                    b.Property<string>("Room")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("IdEmployee");

                    b.ToTable("Locations");
                });

            modelBuilder.Entity("WebApi.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsEditTask")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsEditWS")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsTransfer")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsUpgrade")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsWriteOff")
                        .HasColumnType("boolean");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("WebApi.Entities.Task", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Comment")
                        .HasColumnType("text");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("IdTaskType")
                        .HasColumnType("integer");

                    b.Property<int>("IdUser")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("IdTaskType");

                    b.HasIndex("IdUser");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("WebApi.Entities.TaskDeviceTransfer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("IdDevice")
                        .HasColumnType("integer");

                    b.Property<int?>("IdLocation")
                        .HasColumnType("integer");

                    b.Property<int>("IdTask")
                        .HasColumnType("integer");

                    b.Property<int?>("IdWorkstation")
                        .HasColumnType("integer");

                    b.Property<string>("UseType")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("IdDevice");

                    b.HasIndex("IdLocation");

                    b.HasIndex("IdTask");

                    b.HasIndex("IdWorkstation");

                    b.ToTable("TaskDeviceTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.TaskType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("TaskTypes");
                });

            modelBuilder.Entity("WebApi.Entities.TaskWorkstationTransfer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int?>("IdEmployee")
                        .HasColumnType("integer");

                    b.Property<int>("IdLocation")
                        .HasColumnType("integer");

                    b.Property<int>("IdTask")
                        .HasColumnType("integer");

                    b.Property<int>("IdWorkstation")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("IdEmployee");

                    b.HasIndex("IdLocation");

                    b.HasIndex("IdTask");

                    b.HasIndex("IdWorkstation");

                    b.ToTable("TaskWorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("Mail")
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("text");

                    b.Property<string>("Patronymic")
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("WebApi.Entities.Workstation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("IpAddress")
                        .HasColumnType("text");

                    b.Property<bool>("IsDisassembled")
                        .HasColumnType("boolean");

                    b.Property<string>("NetworkName")
                        .HasColumnType("text");

                    b.Property<string>("RegisterNumber")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Workstations");
                });

            modelBuilder.Entity("WebApi.Entities.WorkstationTransfer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfInstallation")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime?>("DateOfRemoval")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("IdEmployee")
                        .HasColumnType("integer");

                    b.Property<int>("IdLocation")
                        .HasColumnType("integer");

                    b.Property<int>("IdWorkstation")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("IdEmployee");

                    b.HasIndex("IdLocation");

                    b.HasIndex("IdWorkstation");

                    b.ToTable("WorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.WrittingOffAct", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("DateOfDebit")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("WrittingOffActs");
                });

            modelBuilder.Entity("WebApi.Entities.WrittingOffActFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("FileName")
                        .HasColumnType("text");

                    b.Property<int>("IdWrittingOffAct")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("IdWrittingOffAct");

                    b.ToTable("WrittingOffActFiles");
                });

            modelBuilder.Entity("WebApi.Models.DeviceTypes.DeviceTypeRequest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<int>("CurrentQuantity")
                        .HasColumnType("integer");

                    b.Property<int>("MinimalQuantity")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("DeviceTypeRequests");
                });

            modelBuilder.Entity("RoleUser", b =>
                {
                    b.HasOne("WebApi.Entities.Role", null)
                        .WithMany()
                        .HasForeignKey("RolesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UsersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("WebApi.Entities.Device", b =>
                {
                    b.HasOne("WebApi.Entities.DeviceParameter", null)
                        .WithMany("Device")
                        .HasForeignKey("DeviceParameterId");

                    b.HasOne("WebApi.Entities.DeviceModel", "DeviceModel")
                        .WithMany("Devices")
                        .HasForeignKey("IdDeviceModel")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.WrittingOffAct", "WrittingOffAct")
                        .WithMany("Devices")
                        .HasForeignKey("IdWrittingOffAct")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("DeviceModel");

                    b.Navigation("WrittingOffAct");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceModel", b =>
                {
                    b.HasOne("WebApi.Entities.DeviceType", "DeviceType")
                        .WithMany("DeviceModels")
                        .HasForeignKey("IdDeviceType")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("DeviceType");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceParameter", b =>
                {
                    b.HasOne("WebApi.Entities.DeviceModel", null)
                        .WithMany("DeviceParameters")
                        .HasForeignKey("DeviceModelId");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceParameterValue", b =>
                {
                    b.HasOne("WebApi.Entities.DeviceModel", "DeviceModel")
                        .WithMany("DeviceParameterValues")
                        .HasForeignKey("DeviceModelId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.DeviceParameter", "DeviceParameter")
                        .WithMany("DeviceParameterValues")
                        .HasForeignKey("DeviceParameterId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeviceModel");

                    b.Navigation("DeviceParameter");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceTransfer", b =>
                {
                    b.HasOne("WebApi.Entities.Device", "Device")
                        .WithMany("DeviceTransfers")
                        .HasForeignKey("IdDevice")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Location", "Location")
                        .WithMany("DeviceTransfers")
                        .HasForeignKey("IdLocation")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("WebApi.Entities.Workstation", "Workstation")
                        .WithMany("DeviceTransfers")
                        .HasForeignKey("IdWorkstation")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Device");

                    b.Navigation("Location");

                    b.Navigation("Workstation");
                });

            modelBuilder.Entity("WebApi.Entities.Location", b =>
                {
                    b.HasOne("WebApi.Entities.Employee", "Employee")
                        .WithMany("Locations")
                        .HasForeignKey("IdEmployee")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Employee");
                });

            modelBuilder.Entity("WebApi.Entities.Task", b =>
                {
                    b.HasOne("WebApi.Entities.TaskType", "TaskType")
                        .WithMany("Tasks")
                        .HasForeignKey("IdTaskType")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.User", "User")
                        .WithMany("Tasks")
                        .HasForeignKey("IdUser")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("TaskType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("WebApi.Entities.TaskDeviceTransfer", b =>
                {
                    b.HasOne("WebApi.Entities.Device", "Device")
                        .WithMany("TaskDeviceTransfers")
                        .HasForeignKey("IdDevice")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Location", "Location")
                        .WithMany("TaskDeviceTransfers")
                        .HasForeignKey("IdLocation")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("WebApi.Entities.Task", "Task")
                        .WithMany("TaskDeviceTransfers")
                        .HasForeignKey("IdTask")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Workstation", "Workstation")
                        .WithMany("TaskDeviceTransfers")
                        .HasForeignKey("IdWorkstation")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.Navigation("Device");

                    b.Navigation("Location");

                    b.Navigation("Task");

                    b.Navigation("Workstation");
                });

            modelBuilder.Entity("WebApi.Entities.TaskWorkstationTransfer", b =>
                {
                    b.HasOne("WebApi.Entities.Employee", "Employee")
                        .WithMany("TaskWorkstationTransfers")
                        .HasForeignKey("IdEmployee")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("WebApi.Entities.Location", "Location")
                        .WithMany("TaskWorkstationTransfers")
                        .HasForeignKey("IdLocation")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Task", "Task")
                        .WithMany("TaskWorkstationTransfers")
                        .HasForeignKey("IdTask")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Workstation", "Workstation")
                        .WithMany("TaskWorkstationTransfers")
                        .HasForeignKey("IdWorkstation")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Location");

                    b.Navigation("Task");

                    b.Navigation("Workstation");
                });

            modelBuilder.Entity("WebApi.Entities.WorkstationTransfer", b =>
                {
                    b.HasOne("WebApi.Entities.Employee", "Employee")
                        .WithMany("WorkstationTransfers")
                        .HasForeignKey("IdEmployee")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("WebApi.Entities.Location", "Location")
                        .WithMany("WorkstationTransfers")
                        .HasForeignKey("IdLocation")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("WebApi.Entities.Workstation", "Workstation")
                        .WithMany("WorkstationTransfers")
                        .HasForeignKey("IdWorkstation")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Employee");

                    b.Navigation("Location");

                    b.Navigation("Workstation");
                });

            modelBuilder.Entity("WebApi.Entities.WrittingOffActFile", b =>
                {
                    b.HasOne("WebApi.Entities.WrittingOffAct", "WrittingOffAct")
                        .WithMany("WrittingOffActFiles")
                        .HasForeignKey("IdWrittingOffAct")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("WrittingOffAct");
                });

            modelBuilder.Entity("WebApi.Entities.Device", b =>
                {
                    b.Navigation("DeviceTransfers");

                    b.Navigation("TaskDeviceTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceModel", b =>
                {
                    b.Navigation("DeviceParameterValues");

                    b.Navigation("DeviceParameters");

                    b.Navigation("Devices");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceParameter", b =>
                {
                    b.Navigation("Device");

                    b.Navigation("DeviceParameterValues");
                });

            modelBuilder.Entity("WebApi.Entities.DeviceType", b =>
                {
                    b.Navigation("DeviceModels");
                });

            modelBuilder.Entity("WebApi.Entities.Employee", b =>
                {
                    b.Navigation("Locations");

                    b.Navigation("TaskWorkstationTransfers");

                    b.Navigation("WorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.Location", b =>
                {
                    b.Navigation("DeviceTransfers");

                    b.Navigation("TaskDeviceTransfers");

                    b.Navigation("TaskWorkstationTransfers");

                    b.Navigation("WorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.Task", b =>
                {
                    b.Navigation("TaskDeviceTransfers");

                    b.Navigation("TaskWorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.TaskType", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("WebApi.Entities.User", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("WebApi.Entities.Workstation", b =>
                {
                    b.Navigation("DeviceTransfers");

                    b.Navigation("TaskDeviceTransfers");

                    b.Navigation("TaskWorkstationTransfers");

                    b.Navigation("WorkstationTransfers");
                });

            modelBuilder.Entity("WebApi.Entities.WrittingOffAct", b =>
                {
                    b.Navigation("Devices");

                    b.Navigation("WrittingOffActFiles");
                });
#pragma warning restore 612, 618
        }
    }
}
