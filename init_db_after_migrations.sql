INSERT INTO "Employees"("Id",
                        "PersonnelNumber",
                        "LastName", "FirstName", "Patronymic",
                        "Position", "Department") values
    (1, '0001123','Иванов', 'Иван', 'Иванович', 'Руководитель', 'Группа АСУ');

INSERT INTO "Employees"("Id",
                        "PersonnelNumber",
                        "LastName", "FirstName", "Patronymic",
                        "Position", "Department") values
    (2, '0000333','Петров', 'Петр', 'Сидорович', 'Бухгалтер', 'Группа АСУ');

INSERT INTO "Employees"("Id",
                        "PersonnelNumber",
                        "LastName", "FirstName", "Patronymic",
                        "Position", "Department") values
    (3, '000067','Фоминых', 'Игорь', 'Степанович', 'Инженер 3й категории', 'Отдел кадров');


INSERT INTO "Locations"("Id","House", "Room", "IdEmployee") VALUES
    (1,'001','113',2);
INSERT INTO "Locations"("Id","House", "Room", "IdEmployee") VALUES
    (2,'001','211',1);
INSERT INTO "Locations"("Id","House", "Room", "IdEmployee") VALUES
    (3,'006','207',3);



insert INTO "Workstations"("Id","RegisterNumber",
                           "NetworkName",
                           "IpAddress",
                           "IsDisassembled"
                           ) VALUES
    (1,'001', 'PMZ01','192.168.0.1',false);
insert INTO "Workstations"("Id","RegisterNumber",
                           "NetworkName",
                           "IpAddress",
                           "IsDisassembled") VALUES
    (2,'011', 'PMZ11','192.168.0.2',false);
insert INTO "Workstations"("Id","RegisterNumber",
                           "NetworkName",
                           "IpAddress",
                           "IsDisassembled") VALUES
    (3,'013', 'PMZ13','192.168.0.3',false);

insert INTO "DeviceParameters"("Id","Name")
    values (1, 'Оперативная память');
insert INTO "DeviceParameters"("Id","Name")
    values (2, 'Видеокарта');
insert INTO "DeviceParameters"("Id","Name")
    values (3, 'Диагональ');
insert INTO "DeviceParameters"("Id","Name")
    values (4, 'Процессор');

insert INTO "DeviceTypes"("Id","Name", "MinimalQuantity")
    values (1, 'Системный блок', 30);
insert INTO "DeviceTypes"("Id","Name", "MinimalQuantity")
    values (2, 'Монитор', 30);
insert INTO "DeviceTypes"("Id","Name", "MinimalQuantity")
    values (3, 'Клавиатура', 15);
insert INTO "DeviceTypes"("Id","Name", "MinimalQuantity")
    values (4, 'Ноутбук', 20);
insert INTO "DeviceTypes"("Id","Name", "MinimalQuantity")
    values (5, 'Телефон', 7);

insert INTO "DeviceModels"("Id","Name", "IdDeviceType")
    values (1, 'Asus W2701', 2);
insert INTO "DeviceModels"("Id","Name", "IdDeviceType")
    values (2, 'Lenovo QR2', 4);
insert INTO "DeviceModels"("Id","Name", "IdDeviceType")
    values (3, 'LOC AS1010', 1);
insert INTO "DeviceModels"("Id","Name", "IdDeviceType")
    values (4, 'A4Tech 3130', 3);


insert into "Devices"("InventoryNumber", "IdDeviceModel",
                      "DateOfDebit", "DateOfLastService", "DateOfNextService")
    values ('01000', 1, null, null, null);

insert into "Devices"("InventoryNumber", "IdDeviceModel",
                      "DateOfDebit", "DateOfLastService", "DateOfNextService")
    values ('01011', 2, null, null, null);


insert INTO "DeviceParameterValues"("DeviceParameterId","DeviceId", "Value")
    values (3, 1, '17 дюймов (43,18 см)');
insert INTO "DeviceParameterValues"("DeviceParameterId","DeviceId", "Value")
    values (2,1 , 'Palit GeForce RTX 3090');
insert INTO "DeviceParameterValues"("DeviceParameterId","DeviceId", "Value")
    values (1,1 , 'DDR3 8X2');
insert INTO "DeviceParameterValues"("DeviceParameterId","DeviceId", "Value")
    values (4, 2, 'Intel Core Duo');

insert into "WorkstationTransfers"("DateOfInstallation", "DateOfRemoval",
                                   "IdWorkstation", "IdLocation", "IdEmployee")
    values (TIMESTAMP '2012-08-16 10:00:00',null, 1, 1, 1);

insert into "DeviceTransfers"("DateOfInstallation", "DateOfRemoval", "IdWorkstation",
                        "IdDevice", "IdLocation",  "UseType")
values (TIMESTAMP '2011-05-16 15:36:38',null, 1,1,null, 'рабочее место');

insert into "DeviceTransfers"("DateOfInstallation", "DateOfRemoval", "IdWorkstation",
                        "IdDevice", "IdLocation", "UseType")
values (TIMESTAMP '2012-05-16 16:30:18',null, null,2,1, 'общее пользование');

-- CREATE or replace VIEW DevicesByTypeCount AS
-- select dt."Id", dt."Name", count(d) as Sum, "MinimalQuantity" from "DeviceTypes" dt
--     full join "DeviceModels" dm on dt."Id" = dm."IdDeviceType"
--     full join "Devices" d on dm."Id" = d."IdDeviceModel"
--     where d."DateOfDebit" is null group by dt."Id", dt."Name", "MinimalQuantity";
--
-- CREATE or replace VIEW DevicesByModelCount AS
-- select dm."Id", dm."IdDeviceType", dm."Name", count(d) as Sum from "DeviceModels" dm
--     full join "Devices" d on dm."Id" = d."IdDeviceModel"
--     where d."DateOfDebit" is null group by dm."Id", dm."Name";

-- CREATE or replace VIEW DevicesOnWorkstations AS
--     select * from "Devices" d full join "Transfers" t on d."Id" = T."IdDevice"
--         full join "Workstations" w on t."IdWorkstation" = w."Id"
--     where "DateOfRemoval" is null and d."Id" is not null;

select * from "Devices" d
	left join "DeviceTransfers" dt ON d."Id" = dt."IdDevice"
	left join "Locations" l on l."Id" = dt."IdLocation"
	left join "Workstations" w on w."Id" = dt."IdWorkstation" ;



select * from device_types_get();

CREATE OR REPLACE FUNCTION device_types_get()
	RETURNS TABLE("Id" integer, "Name" text, "MinimalQuantity" integer, "CurrentQuantity" integer) AS $$
    BEGIN
         RETURN QUERY
             select dt."Id" as "Id", dt."Name" as "Name", dt."MinimalQuantity" as "MinimalQuantity" ,
                    sum(case when d."InventoryNumber" is not null and d."DateOfDebit" is null then 1 else 0 end)::integer as "CurrentQuantity" from "DeviceTypes" dt
	left join "DeviceModels" dm on dt."Id" = dm."IdDeviceType"
	left join "Devices" d on d."IdDeviceModel" = dm."Id"
	group by dt."Id", dt."Name", dt."MinimalQuantity";
    END;
$$ LANGUAGE plpgsql;

