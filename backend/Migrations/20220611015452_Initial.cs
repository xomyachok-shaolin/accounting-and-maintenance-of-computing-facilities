using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApi.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DeviceTypeRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    MinimalQuantity = table.Column<int>(type: "integer", nullable: false),
                    CurrentQuantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTypeRequests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeviceTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    MinimalQuantity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PersonnelNumber = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    Patronymic = table.Column<string>(type: "text", nullable: true),
                    Position = table.Column<string>(type: "text", nullable: true),
                    Department = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    IsWriteOff = table.Column<bool>(type: "boolean", nullable: false),
                    IsTransfer = table.Column<bool>(type: "boolean", nullable: false),
                    IsUpgrade = table.Column<bool>(type: "boolean", nullable: false),
                    IsEditWS = table.Column<bool>(type: "boolean", nullable: false),
                    IsEditTask = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaskTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    Patronymic = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    Mail = table.Column<string>(type: "text", nullable: true),
                    Username = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Workstations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RegisterNumber = table.Column<string>(type: "text", nullable: true),
                    NetworkName = table.Column<string>(type: "text", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    IsDisassembled = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workstations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WrittingOffActs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    DateOfDebit = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WrittingOffActs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeviceModels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    IdDeviceType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceModels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceModels_DeviceTypes_IdDeviceType",
                        column: x => x.IdDeviceType,
                        principalTable: "DeviceTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Room = table.Column<string>(type: "text", nullable: true),
                    House = table.Column<string>(type: "text", nullable: true),
                    IdEmployee = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Locations_Employees_IdEmployee",
                        column: x => x.IdEmployee,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RoleUser",
                columns: table => new
                {
                    RolesId = table.Column<int>(type: "integer", nullable: false),
                    UsersId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleUser", x => new { x.RolesId, x.UsersId });
                    table.ForeignKey(
                        name: "FK_RoleUser_Roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleUser_Users_UsersId",
                        column: x => x.UsersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tasks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateCreated = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IdUser = table.Column<int>(type: "integer", nullable: false),
                    IdTaskType = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tasks_TaskTypes_IdTaskType",
                        column: x => x.IdTaskType,
                        principalTable: "TaskTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Tasks_Users_IdUser",
                        column: x => x.IdUser,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WrittingOffActFiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdWrittingOffAct = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WrittingOffActFiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WrittingOffActFiles_WrittingOffActs_IdWrittingOffAct",
                        column: x => x.IdWrittingOffAct,
                        principalTable: "WrittingOffActs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeviceParameters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    DeviceModelId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceParameters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceParameters_DeviceModels_DeviceModelId",
                        column: x => x.DeviceModelId,
                        principalTable: "DeviceModels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WorkstationTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateOfInstallation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfRemoval = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IdWorkstation = table.Column<int>(type: "integer", nullable: false),
                    IdLocation = table.Column<int>(type: "integer", nullable: false),
                    IdEmployee = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkstationTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkstationTransfers_Employees_IdEmployee",
                        column: x => x.IdEmployee,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkstationTransfers_Locations_IdLocation",
                        column: x => x.IdLocation,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WorkstationTransfers_Workstations_IdWorkstation",
                        column: x => x.IdWorkstation,
                        principalTable: "Workstations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TaskWorkstationTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdTask = table.Column<int>(type: "integer", nullable: false),
                    IdWorkstation = table.Column<int>(type: "integer", nullable: false),
                    IdLocation = table.Column<int>(type: "integer", nullable: false),
                    IdEmployee = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskWorkstationTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskWorkstationTransfers_Employees_IdEmployee",
                        column: x => x.IdEmployee,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskWorkstationTransfers_Locations_IdLocation",
                        column: x => x.IdLocation,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TaskWorkstationTransfers_Tasks_IdTask",
                        column: x => x.IdTask,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskWorkstationTransfers_Workstations_IdWorkstation",
                        column: x => x.IdWorkstation,
                        principalTable: "Workstations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeviceParameterValues",
                columns: table => new
                {
                    DeviceModelId = table.Column<int>(type: "integer", nullable: false),
                    DeviceParameterId = table.Column<int>(type: "integer", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceParameterValues", x => new { x.DeviceParameterId, x.DeviceModelId });
                    table.ForeignKey(
                        name: "FK_DeviceParameterValues_DeviceModels_DeviceModelId",
                        column: x => x.DeviceModelId,
                        principalTable: "DeviceModels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeviceParameterValues_DeviceParameters_DeviceParameterId",
                        column: x => x.DeviceParameterId,
                        principalTable: "DeviceParameters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Devices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InventoryNumber = table.Column<string>(type: "text", nullable: true),
                    IdDeviceModel = table.Column<int>(type: "integer", nullable: false),
                    IdWrittingOffAct = table.Column<int>(type: "integer", nullable: true),
                    DateOfLastService = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DateOfNextService = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeviceParameterId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Devices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Devices_DeviceModels_IdDeviceModel",
                        column: x => x.IdDeviceModel,
                        principalTable: "DeviceModels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Devices_DeviceParameters_DeviceParameterId",
                        column: x => x.DeviceParameterId,
                        principalTable: "DeviceParameters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Devices_WrittingOffActs_IdWrittingOffAct",
                        column: x => x.IdWrittingOffAct,
                        principalTable: "WrittingOffActs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DeviceTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DateOfInstallation = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateOfRemoval = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IdDevice = table.Column<int>(type: "integer", nullable: false),
                    UseType = table.Column<string>(type: "text", nullable: true),
                    IdLocation = table.Column<int>(type: "integer", nullable: true),
                    IdWorkstation = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceTransfers_Devices_IdDevice",
                        column: x => x.IdDevice,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DeviceTransfers_Locations_IdLocation",
                        column: x => x.IdLocation,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_DeviceTransfers_Workstations_IdWorkstation",
                        column: x => x.IdWorkstation,
                        principalTable: "Workstations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "TaskDeviceTransfers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IdTask = table.Column<int>(type: "integer", nullable: false),
                    IdDevice = table.Column<int>(type: "integer", nullable: false),
                    UseType = table.Column<string>(type: "text", nullable: true),
                    IdLocation = table.Column<int>(type: "integer", nullable: true),
                    IdWorkstation = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaskDeviceTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TaskDeviceTransfers_Devices_IdDevice",
                        column: x => x.IdDevice,
                        principalTable: "Devices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskDeviceTransfers_Locations_IdLocation",
                        column: x => x.IdLocation,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TaskDeviceTransfers_Tasks_IdTask",
                        column: x => x.IdTask,
                        principalTable: "Tasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TaskDeviceTransfers_Workstations_IdWorkstation",
                        column: x => x.IdWorkstation,
                        principalTable: "Workstations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeviceModels_IdDeviceType",
                table: "DeviceModels",
                column: "IdDeviceType");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceParameters_DeviceModelId",
                table: "DeviceParameters",
                column: "DeviceModelId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceParameterValues_DeviceModelId",
                table: "DeviceParameterValues",
                column: "DeviceModelId");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_DeviceParameterId",
                table: "Devices",
                column: "DeviceParameterId");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_IdDeviceModel",
                table: "Devices",
                column: "IdDeviceModel");

            migrationBuilder.CreateIndex(
                name: "IX_Devices_IdWrittingOffAct",
                table: "Devices",
                column: "IdWrittingOffAct");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceTransfers_IdDevice",
                table: "DeviceTransfers",
                column: "IdDevice");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceTransfers_IdLocation",
                table: "DeviceTransfers",
                column: "IdLocation");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceTransfers_IdWorkstation",
                table: "DeviceTransfers",
                column: "IdWorkstation");

            migrationBuilder.CreateIndex(
                name: "IX_Locations_IdEmployee",
                table: "Locations",
                column: "IdEmployee");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoleUser_UsersId",
                table: "RoleUser",
                column: "UsersId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskDeviceTransfers_IdDevice",
                table: "TaskDeviceTransfers",
                column: "IdDevice");

            migrationBuilder.CreateIndex(
                name: "IX_TaskDeviceTransfers_IdLocation",
                table: "TaskDeviceTransfers",
                column: "IdLocation");

            migrationBuilder.CreateIndex(
                name: "IX_TaskDeviceTransfers_IdTask",
                table: "TaskDeviceTransfers",
                column: "IdTask");

            migrationBuilder.CreateIndex(
                name: "IX_TaskDeviceTransfers_IdWorkstation",
                table: "TaskDeviceTransfers",
                column: "IdWorkstation");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_IdTaskType",
                table: "Tasks",
                column: "IdTaskType");

            migrationBuilder.CreateIndex(
                name: "IX_Tasks_IdUser",
                table: "Tasks",
                column: "IdUser");

            migrationBuilder.CreateIndex(
                name: "IX_TaskWorkstationTransfers_IdEmployee",
                table: "TaskWorkstationTransfers",
                column: "IdEmployee");

            migrationBuilder.CreateIndex(
                name: "IX_TaskWorkstationTransfers_IdLocation",
                table: "TaskWorkstationTransfers",
                column: "IdLocation");

            migrationBuilder.CreateIndex(
                name: "IX_TaskWorkstationTransfers_IdTask",
                table: "TaskWorkstationTransfers",
                column: "IdTask");

            migrationBuilder.CreateIndex(
                name: "IX_TaskWorkstationTransfers_IdWorkstation",
                table: "TaskWorkstationTransfers",
                column: "IdWorkstation");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkstationTransfers_IdEmployee",
                table: "WorkstationTransfers",
                column: "IdEmployee");

            migrationBuilder.CreateIndex(
                name: "IX_WorkstationTransfers_IdLocation",
                table: "WorkstationTransfers",
                column: "IdLocation");

            migrationBuilder.CreateIndex(
                name: "IX_WorkstationTransfers_IdWorkstation",
                table: "WorkstationTransfers",
                column: "IdWorkstation");

            migrationBuilder.CreateIndex(
                name: "IX_WrittingOffActFiles_IdWrittingOffAct",
                table: "WrittingOffActFiles",
                column: "IdWrittingOffAct");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeviceParameterValues");

            migrationBuilder.DropTable(
                name: "DeviceTransfers");

            migrationBuilder.DropTable(
                name: "DeviceTypeRequests");

            migrationBuilder.DropTable(
                name: "RoleUser");

            migrationBuilder.DropTable(
                name: "TaskDeviceTransfers");

            migrationBuilder.DropTable(
                name: "TaskWorkstationTransfers");

            migrationBuilder.DropTable(
                name: "WorkstationTransfers");

            migrationBuilder.DropTable(
                name: "WrittingOffActFiles");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Devices");

            migrationBuilder.DropTable(
                name: "Tasks");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropTable(
                name: "Workstations");

            migrationBuilder.DropTable(
                name: "DeviceParameters");

            migrationBuilder.DropTable(
                name: "WrittingOffActs");

            migrationBuilder.DropTable(
                name: "TaskTypes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "DeviceModels");

            migrationBuilder.DropTable(
                name: "DeviceTypes");
        }
    }
}
