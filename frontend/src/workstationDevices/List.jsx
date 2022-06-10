/* eslint-disable default-case */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import MaskedInput from "antd-mask-input";

import {
  useDeviceDetailActions,
  useDeviceTypeActions,
  useAlertActions,
  useLocationActions,
  useWorkstationActions,
} from "_actions";
import {
  Form,
  Modal,
  Spin,
  Table,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Tree,
  Descriptions,
  Drawer,
  Radio,
  Layout,
  Button,
  Cascader,
} from "antd";

import moment from "moment";

import { ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";

import {
  filterDevicesAtom,
  employeesAtom,
  deviceTypesAtom,
  locationsAtom,
  workstationsAtom,
} from "_state";
import React from "react";
import Search from "antd/lib/input/Search";

import Highlighter from "react-highlight-words";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

import { TableTransfer } from "./TableTransfer";

export { List };

function List({ match }) {
  const [form] = Form.useForm();
  const [formDrawer] = Form.useForm();
  const { Header, Footer, Sider, Content } = Layout;

  const DUMB_IP_MASK = "0[0][0].0[0][0].0[0][0].0[0][0]";
  const [ipAddress, setIpAddress] = useState("");

  const alertActions = useAlertActions();

  const [visibleWS, setVisibleWS] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const { confirm } = Modal;

  const locations = useRecoilValue(locationsAtom);
  const employees = useRecoilValue(employeesAtom);
  const allWorkstations = useRecoilValue(workstationsAtom);

  const deviceDetailActions = useDeviceDetailActions();
  const deviceTypeActions = useDeviceTypeActions();
  const locationActions = useLocationActions();
  const workstationActions = useWorkstationActions();

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [useModeDevice, setUseModeDevice] = useState(null);
  const [disabledCascader, setDisabledCascader] = useState(true);
  const [modeCascader, setModeCascader] = useState(true);

  const [isEditWS, setIsEditWS] = useState(false);
  const [editWS, setEditWS] = useState(null);

  useEffect(() => {
    deviceDetailActions.getAll();
    deviceTypeActions.getAll();
    locationActions.getAll();
    workstationActions.getAll();
    return locationActions.resetLocations;
  }, []);

  useEffect(() => {
    locationActions.getAllEmployees();
    return locationActions.resetEmployees;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceDetailActions.getAll();
      deviceTypeActions.getAll();
      workstationActions.getAll();
      locationActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  const showDefaultDrawer = () => {
    setVisibleDrawer(true);
    formDrawer.setFieldsValue({
      location: "",
      useType: "",
    });
  };

  const [moveDevices, setMoveDevices] = useState(null);
  const [moveExcDevices, setMoveExcDevices] = useState(null);
  const [titleDrawer, setTitleDrawer] = useState("");
  const [isLocationDrawer, setIsLocationDrawer] = useState("");

  function onSubmitDrawer() {
    let data = formDrawer.getFieldsValue();

    console.log(data, isLocationDrawer);
    switch (data.useType) {
      case 1:
        data.isCommonUse = true;
        data.isReserve = false;
        data.location = isLocationDrawer[1];
        break;
      case 2:
        data.isCommonUse = false;
        data.isReserve = true;
        data.location = isLocationDrawer[1];
        break;
      case 3:
        data.location = isLocationDrawer[2];
        break;
    }
    data.setOfDevices = moveExcDevices;
    return workstationActions.updateDevices(data).then(() => {
      setIsResetAll(true);
      console.log(data);

      let initial = initialTargetKeys;
      moveExcDevices.forEach((d) => {
        initial.pop(d);

        filterDeviceTransfers.forEach((dt) => {
          if (data.setOfDevices.includes(dt.inventoryNumber)) {
            dt.useType = data.useType;

            switch (data.useType) {
              case 1:
                dt.useType = "общее пользование";
                locations.forEach((l) => {
                  console.log(l);
                  if (data.location == l.id) dt.location = l;
                });
                break;
              case 2:
                dt.useType = "резерв";
                locations.forEach((l) => {
                  if (data.location == l.id) dt.location = l;
                });
                break;
              case 3:
                dt.useType = "рабочее место";
                locations.forEach((l) => {
                  l.workstationTransfers.forEach((wt) => {
                    if (wt.dateOfRemoval == null)
                      if (data.location == wt.workstation.id) {
                        dt.location = l;
                        dt.workstation = wt.workstation;
                      }
                  });
                });
                break;
            }

            console.log(dt);
          }
        });
      });
      setInitialTargetKeys(initial);

      setVisibleDrawer(false);
      setDisabledCascader(true);
      setTargetKeys(moveDevices);
      // setIsResetAll(true);

      alertActions.success("Информация об устройстве обновлена");
    });
  }

  const onCloseDrawer = () => {
    setVisibleDrawer(false);
    setDisabledCascader(true);
    setIsLocationDrawer("");
  };
  function changeCascader(e) {
    setUseModeDevice(e.target.value);
    setDisabledCascader(false);
    setIsLocationDrawer("");
    if (e.target.value == 3) setModeCascader(false);
    else setModeCascader(true);
    setDisabledCascader(false);
  }

  function onChangeLocationDrawer(e) {
    console.log(e);
    setIsLocationDrawer(e);
  }

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <Space direction="vertical" style={{ padding: 8 }}>
        {(dataIndex == "inventoryNumber" ||
          dataIndex == "location" ||
          dataIndex == "deviceModel" ||
          dataIndex == "deviceType" ||
          dataIndex == "useType" ||
          dataIndex == "employee" ||
          dataIndex == "registerNumber" ||
          dataIndex == "networkName" ||
          dataIndex == "ipAddress") && (
          <Input
            // ref={ searchInput }
            placeholder={`Поиск по ${
              dataIndex == "inventoryNumber"
                ? "инвентарному №"
                : dataIndex == "location"
                ? "местоположению"
                : dataIndex == "deviceModel"
                ? "модели"
                : dataIndex == "useType"
                ? "типу пользования"
                : dataIndex == "deviceType"
                ? "типу устройства"
                : dataIndex == "employee"
                ? "ответственному"
                : dataIndex == "registerNumber"
                ? "регистрационному №"
                : dataIndex == "networkName"
                ? "сетевому имени"
                : dataIndex == "ipAddress"
                ? "IP-адресу"
                : dataIndex
            }`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
        )}
        {(dataIndex == "dateOfLastService" ||
          dataIndex == "dateOfNextService" ||
          dataIndex == "dateOfInstallation" ||
          dataIndex == "dateOfRemoval") && (
          <DatePicker.RangePicker
            onChange={(date, dateString) => {
              setSelectedKeys(date ? [date] : []);
              handleDatePickerChange(date, dateString, 1);
            }}
            placeholder={[`c`, `по`]}
            value={selectedKeys[0]}
            style={{ marginRight: 8, width: 250 }}
          />
        )}
        <Space>
          {dataIndex != "dateOfNextService" &&
            dataIndex != "dateOfLastService" &&
            dataIndex != "dateOfInstallation" &&
            dataIndex != "dateOfRemoval" && (
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Искать
              </Button>
            )}
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            type="link"
            style={{ width: 90 }}
          >
            Сброс
          </Button>
          <Button
            type="dashed"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
            icon={<FilterOutlined />}
          >
            Фильтр
          </Button>
        </Space>
      </Space>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex == "dateOfLastService" || dataIndex == "dateOfNextService")
        return record[dataIndex]
          ? moment(value[0]).isBefore(
              moment(record[dataIndex]).format("YYYY-MM-DD")
            ) &&
            moment(value[1]).isAfter(
              moment(record[dataIndex]).format("YYYY-MM-DD")
            )
            ? true
            : false
          : false;

      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false;
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleDatePickerChange = (date, dateString, id) => {
    console.log(id, date, dateString);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columnsDevices = [
    {
      title: "Инвентарный №",
      dataIndex: "inventoryNumber",
      id: "inventoryNumber",
      ...getColumnSearchProps("inventoryNumber"),
      sorter: (a, b) => a.inventoryNumber.localeCompare(b.inventoryNumber),
    },
    {
      title: "Модель",
      dataIndex: "deviceModel",
      id: "deviceModel",
      ...getColumnSearchProps("deviceModel"),
      sorter: (a, b) => a.deviceModel.localeCompare(b.deviceModel),
    },
    {
      title: "Тип устройства",
      dataIndex: "deviceType",
      id: "deviceType",
      ...getColumnSearchProps("deviceType"),
      sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
    },
    {
      title: "Вид пользования",
      dataIndex: "useType",
      id: "useType",
      filters: [
        { text: "общее пользование", value: "общее пользование" },
        { text: "резерв", value: "резерв" },
        { text: "рабочее место", value: "рабочее место" },
      ],
      onFilter: (value, record) => record.useType === value,
      render: (t, r) => (
        <span>
          <Tag color="geekblue">{t}</Tag>
        </span>
      ),
    },
    {
      title: "Здание/Помещение/РМ",
      dataIndex: "location",
      id: "location",
      ...getColumnSearchProps("location"),
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Дата последнего обслуживания",
      key: "dateOfLastService",
      id: "dateOfLastService",
      ...getColumnSearchProps("dateOfLastService"),
      render: (t, r) =>
        r.dateOfLastService
          ? moment(r.dateOfLastService).format("DD/MM/YYYY h:mm:ss")
          : "",
      sorter: (a, b) => {
        a = a.dateOfLastService || "";
        b = b.dateOfLastService || "";
        a.localeCompare(b);
      },
    },
    {
      title: "Дата следующего обслуживания",
      key: "dateOfNextService",
      id: "dateOfNextService",
      ...getColumnSearchProps("dateOfNextService"),
      render: (t, r) =>
        r.dateOfNextService
          ? moment(r.dateOfNextService).format("DD/MM/YYYY h:mm:ss")
          : "",
      sorter: (a, b) => {
        a = a.dateOfNextService || "";
        b = b.dateOfNextService || "";
        a.localeCompare(b);
      },
    },
  ];

  const columnsParameters = [
    {
      title: "Регистрационный №",
      dataIndex: "registerNumber",
      id: "registerNumber",
      ...getColumnSearchProps("registerNumber"),
      sorter: (a, b) => a.registerNumber.localeCompare(b.registerNumber),
    },
    {
      title: "Сетевое имя",
      dataIndex: "networkName",
      id: "networkName",
      ...getColumnSearchProps("networkName"),
      sorter: (a, b) => a.networkName.localeCompare(b.networkName),
    },
    {
      title: "IP-адрес",
      dataIndex: "ipAddress",
      id: "ipAddress",
      ...getColumnSearchProps("ipAddress"),
      sorter: (a, b) => a.ipAddress.localeCompare(b.ipAddress),
    },

    {
      title: "Дата и время установки",
      dataIndex: "dateOfInstallation",
      id: "dateOfInstallation",
      ...getColumnSearchProps("dateOfInstallation"),
      render: (t, r) =>
        r.dateOfInstallation
          ? moment(r.dateOfInstallation).format("DD/MM/YYYY h:mm:ss")
          : "",
      sorter: (a, b) => {
        a = a.dateOfInstallation || "";
        b = b.dateOfInstallation || "";
        a.localeCompare(b);
      },
    },
    //    Table.EXPAND_COLUMN,
    {
      title: "Отвественный",
      dataIndex: "employee",
      id: "employee",
      ...getColumnSearchProps("employee"),
      sorter: (a, b) => a.employee.localeCompare(b.employee),
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record.key)}>
            Редактировать
          </Button>
          <Button
            danger
            onClick={() => showDeleteModal(record.key)}
            disabled={record.isDeleting}
          >
            {record.isDeleting ? <Spin /> : <span>Удалить</span>}
          </Button>
        </Space>
      ),
    },
  ];

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const [filterDevices, setFilterDevices] = useRecoilState(filterDevicesAtom);
  const [filterWorkstations, setfilterWorkstations] = useState([]);

  console.log(editWS);
  const onSelect = (selectedKeys, info) => {
    setIsDefaultEmpty(false);

    var node = info.node;
    var devices = [];
    var workstations = [];

    let regexpWS = /\d-\d-\d-\d/,
      regexpRoom = /\d-\d-\d/;

    if (regexpWS.test(node.pos)) {
      setIsEditWS(true);
      locations.forEach((l) => {
        l.workstationTransfers.forEach((wt) => {
          console.log(wt);
          if (wt.dateOfRemoval == null)
            if (wt.workstation.id == node.key) {
              let workstation = JSON.parse(JSON.stringify(wt.workstation));
              workstation.wt = wt;
              setEditWS(workstation);
              console.log(workstation, node.key);
              workstations.push({
                key: workstation.id,
                registerNumber: workstation.registerNumber,
                networkName: workstation.networkName,
                ipAddress: workstation.ipAddress,
                dateOfInstallation: workstation.wt.dateOfInstallation,
                wt: wt,
              });
            }
        });

        l.deviceTransfers.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));

          console.log(dt);
          device.useType = dt.useType;
          device.location = l;

          if (dt.dateOfRemoval == null)
            if (dt.idWorkstation == node.key) {
              console.log(dt);
              devices.push(device);
              // l.workstationTransfers[0]?.workstation)
            }
        });
      });

      allWorkstations.forEach((w) => {
        w.deviceTransfers?.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          locations.forEach((l) => {
            l.workstationTransfers.forEach((wt) => {
              if (wt.dateOfRemoval == null)
                if (wt.workstation.id == w.id) device.location = l;
            });
          });
          device.useType = dt.useType;
          device.workstation = w;
          if (dt.dateOfRemoval == null)
            if (dt.idWorkstation == node.key) {
              // console.log(dt);
              devices.push(device);
            }
        });
      });
    } else if (regexpRoom.test(node.pos)) {
      setIsEditWS(false);
      locations.forEach((l) => {
        l.deviceTransfers.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          device.useType = dt.useType;
          device.location = l;
          if (dt.dateOfRemoval == null)
            if (device.location.id == node.key.slice(12)) {
              devices.push(device);
            }
        });
      });

      allWorkstations.forEach((w) => {
        w.deviceTransfers?.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          locations.forEach((l) => {
            l.workstationTransfers.forEach((wt) => {
              if (wt.dateOfRemoval == null)
                if (wt.workstation.id == w.id) device.location = l;
            });
          });
          device.useType = dt.useType;
          device.workstation = w;
            if (dt.dateOfRemoval == null)
            if (device.location.id == node.key.slice(12)) {
              devices.push(device);
            }
        });
      });
    } else {
      locations.forEach((l) => {
        setIsEditWS(false);
        l.deviceTransfers.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          device.useType = dt.useType;
          device.location = l;
          if (dt.dateOfRemoval == null)
            if (l.house == node.key) {
              devices.push(device);
            }
        });
      });

      allWorkstations.forEach((w) => {
        w.deviceTransfers?.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          locations.forEach((l) => {
            l.workstationTransfers.forEach((wt) => {
              if (wt.dateOfRemoval == null)
                if (wt.workstation.id == w.id) device.location = l;
            });
          });
          device.useType = dt.useType;
          device.workstation = w;
            if (dt.dateOfRemoval == null)
            if (device.location.house == node.key) {
              devices.push(device);
            }
        });
      });
    }

    console.log(devices);
    setFilterDevices(devices);

    locations.forEach((l) => {
      if (typeof node.key == "string")
        if (l.id == node.key.slice(12) || l.house == node.key)
          l.workstationTransfers.forEach((wt) => {
            console.log(wt);
            if (wt.dateOfRemoval == null)
              workstations.push({
                key: wt.id,
                registerNumber: wt.workstation.registerNumber,
                networkName: wt.workstation.networkName,
                ipAddress: wt.workstation.ipAddress,
                dateOfInstallation: wt.dateOfInstallation,
                wt: wt,
              });
          });
    });

    console.log(workstations);
    setfilterWorkstations(workstations);

    console.log(devices);
  };

  const dataDevices = filterDevices?.map(function (row) {
    // console.log(row);
    let useType = row.useType;
    let location =
      useType == "рабочее место"
        ? row.location?.house +
          "/" +
          row.location?.room +
          "/" +
          row.workstation?.registerNumber
        : row.location?.house + "/" + row.location?.room;
    return {
      key: row.id,
      inventoryNumber: row.inventoryNumber,
      deviceModel: row.deviceModel.name,
      deviceType: row.deviceModel.deviceType?.name,
      location: location,
      useType: useType,
      dateOfLastService: row.dateOfLastService,
      dateOfNextService: row.dateOfNextService,
      deviceTransfers: row.deviceTransfers,
    };
  });

  const dataWorkstations = filterWorkstations?.map(function (row) {
    let workstationTransfers = [];
    allWorkstations.forEach((w) => {
      w.workstationTransfers.forEach((wt) => {
        console.log(wt, row);
        if (row.wt?.idWorkstation == wt.idWorkstation)
          workstationTransfers.push(wt);
      });
    });

    console.log(row);
    return {
      key: row.key,
      registerNumber: row.registerNumber,
      networkName: row.networkName,
      ipAddress: row.ipAddress,
      dateOfInstallation: row.dateOfInstallation,
      employee: row.wt?.employee?.personnelNumber,
      workstationTransfers: workstationTransfers,
    };
  });

  /* TREELIST */
  function detailsLocations() {
    const list = [];
    const map = {};
    locations?.forEach((l) => {
      let arr = [],
        room = l.room,
        house = l.house,
        workstations = l.workstationTransfers;

      if (!map[house])
        arr.push({
          title: room,
          key: l.id,
          workstationTransfers: workstations,
        });
      else {
        arr = map[house];
        arr.push({
          title: room,
          key: l.id,
          workstationTransfers: workstations,
        });
      }
      map[house] = arr;
    });

    for (var key in map) {
      const treeNode = {
        title: "Здание " + key,
        key,
      };
      const childrenList = [];
      if (map[key].length != 0)
        // eslint-disable-next-line no-loop-func
        map[key].forEach((r) => {
          const childrenNode = {
            title: "Помещение " + r.title,
            key: "id_location:" + r.key,
          };

          if (r.workstationTransfers.length != 0) {
            const childrenListWS = [];

            r.workstationTransfers.forEach((w) => {
              const childrenNodeWS = {
                title: "РМ " + w.workstation.registerNumber,
                key: w.workstation.id,
              };
              if (w.dateOfRemoval == null) childrenListWS.push(childrenNodeWS);
            });

            if (childrenListWS.length == 0) childrenNode.disabled = true;

            childrenNode.children = childrenListWS;
          }

          childrenList.push(childrenNode);
        });
      treeNode.children = childrenList;

      list.push(treeNode);
    }

    return list;
  }

  function cascaderDetailsLocations() {
    const list = [];
    const map = {};
    locations?.forEach((l) => {
      let arr = [],
        room = l.room,
        house = l.house,
        workstations = l.workstationTransfers;

      if (!map[house]) arr.push({ label: room, value: l.id, ws: workstations });
      else {
        arr = map[house];
        arr.push({ label: room, value: l.id, ws: workstations });
      }
      map[house] = arr;
    });

    for (var key in map) {
      const treeNode = {
        label: "Здание " + key,
        value: key,
      };
      const childrenList = [];
      if (map[key].length != 0)
        // eslint-disable-next-line no-loop-func
        map[key].forEach((r) => {
          const childrenNode = {
            label: "Помещение " + r.label,
            value: r.value,
          };

          childrenList.push(childrenNode);
        });
      treeNode.children = childrenList;

      list.push(treeNode);
    }

    return list;
  }

  function cascaderDetailsLocationDevices() {
    const list = [];
    const map = {};
    locations?.forEach((l) => {
      let arr = [],
        room = l.room,
        house = l.house,
        workstations = l.workstationTransfers;

      if (!map[house]) arr.push({ label: room, value: l.id, ws: workstations });
      else {
        arr = map[house];
        arr.push({ label: room, value: l.id, ws: workstations });
      }
      map[house] = arr;
    });

    for (var key in map) {
      const treeNode = {
        label: "Здание " + key,
        value: key,
      };
      const childrenList = [];
      if (map[key].length != 0)
        // eslint-disable-next-line no-loop-func
        map[key].forEach((r) => {
          const childrenNode = {
            label: "Помещение " + r.label,
            value: r.value,
          };

          if (useModeDevice == 3) {
            const childrenListWS = [];
            r.ws.forEach((w) => {
              if (w.dateOfRemoval == null) {
                const childrenNodeWS = {
                  label: "РМ " + w.workstation.registerNumber,
                  value: w.workstation.id,
                };
                childrenListWS.push(childrenNodeWS);
              }
            });

            if (childrenListWS.length == 0) childrenNode.disabled = true;
            childrenNode.children = childrenListWS;
          }

          childrenList.push(childrenNode);
        });
      treeNode.children = childrenList;

      list.push(treeNode);
    }

    return list;
  }

  const treeData = detailsLocations();
  const treeLocationsData = cascaderDetailsLocations();
  const treeLocationDevicesData = cascaderDetailsLocations();
  const treeLocationDevicesWSData = cascaderDetailsLocationDevices();

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({ key, title: node.title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  generateList(treeData);

  const onChange = (e) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(autoExpandParent);
  };

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substring(0, index);
      const afterStr = item.title.slice(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });

  const showModal = () => {
    setVisibleWS(true);
  };
  const showDeleteModal = (id) => {
    confirm({
      title: "Вы уверены что хотите удалить запись?",
      icon: <ExclamationCircleOutlined />,
      okText: "Да",
      cancelText: "Отмена",
      onOk() {
        // userActions.deleteRole(id);
      },
      onCancel() {},
    });
  };

  const showEditModal = (id) => {
    filterWorkstations.forEach((ws) => {
      console.log(ws, id);
      let location = "";
      if (ws.key === id) {
        console.log(ws);
        setMode(ws);
        locations.forEach((l) => {
          if (l.id == ws.wt.idLocation)
            location = "Здание " + l.house + " / Помещение " + l.room;
        });
        form.setFieldsValue({
          registerNumber: ws.registerNumber,
          networkName: ws.networkName,
          responsible: ws.wt.employee?.id,
          location: location,
          ipAddress: ws.ipAddress,
        });

        showModal();
        return;
      }
    });
  };

  const showAddModalWS = () => {
    setMode(false);
    setInitialTargetKeys([]);
    setTargetKeys([]);

    form.resetFields();
    showModal();
  };

  function createDevice(data) {
    console.log(data);

    data.location = data.location[1];

    return workstationActions.create(data).then(() => {
      setIsResetAll(true);
      setIpAddress("");
      alertActions.success("Рабочее место добавлено");
    });
  }

  function updateDevice(id, data) {
    console.log(data);
    return workstationActions.update(id, data).then(() => {
      setIsResetAll(true);
      setIpAddress("");
      alertActions.success("Информация о рабочем месте обновлена");
    });
  }
  function onSubmit(values) {
    setVisibleWS(false);

    return !mode ? createDevice(values) : updateDevice(mode.id, values);
  }

  const handleCancel = () => {
    setVisibleWS(false);
    setMode(false);
    setIpAddress("");
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const [filterDeviceTransfers, setFilterDeviceTransfers] = useState([]);
  function dataFilterDeviceTransfers() {
    var devices = [];
    if (filterDeviceTransfers.length == 0) {
      locations?.forEach((l) => {
        l.deviceTransfers.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          device.useType = dt.useType;
          device.location = l;

          if (dt.dateOfRemoval == null)
            if (device.location != null) {
              devices.push(device);
            }
        });
      });

      allWorkstations?.forEach((w) => {
        console.log(w);
        w.deviceTransfers?.forEach((dt) => {
          let device = JSON.parse(JSON.stringify(dt.device));
          device.workstation = w;
          device.useType = dt.useType;

          locations.forEach((l) => {
            l.workstationTransfers.forEach((wt) => {
              if (wt.dateOfRemoval == null)
                if (wt.workstation.id == w.id) device.location = l;
            });
          });

          if (dt.dateOfRemoval == null) devices.push(device);
        });
      });
      console.log(devices);
      setFilterDeviceTransfers(devices);
    }
  }

  const dataTransferDevices = Array.from(filterDeviceTransfers)?.map(function (
    row
  ) {
    console.log(row);
    let useType = row.useType;
    let location =
      useType == "рабочее место"
        ? row.location.house +
          "/" +
          row.location.room +
          "/" +
          row.workstation.registerNumber
        : row.location.house + "/" + row.location.room;
    return {
      key: row.inventoryNumber,
      inventoryNumber: row.inventoryNumber,
      deviceModel: row.deviceModel.name,
      deviceType: row.deviceModel.deviceType.name,
      location: location,
      useType: useType,
      dateOfLastService: row.dateOfLastService,
      dateOfNextService: row.dateOfNextService,
    };
  });

  const [targetKeys, setTargetKeys] = useState([]);
  const [initialTargetKeys, setInitialTargetKeys] = useState([]);

  const getMock = () => {
    const originTargetKeys = [];
    console.log(mode);
    if (mode)
      allWorkstations.forEach((w) => {
        w.deviceTransfers?.forEach((dt) => {
          console.log(mode, dt.idWorkstation);
          if (dt.dateOfRemoval == null)
            if (mode.wt.idWorkstation == dt.idWorkstation)
              originTargetKeys.push(dt.device.inventoryNumber);
        });
      });

    setInitialTargetKeys(originTargetKeys);
    setTargetKeys(originTargetKeys);
  };

  useEffect(() => {
    if (mode) {
      dataFilterDeviceTransfers();
      getMock();
      setIpAddress(mode.ipAddress);
    }
  }, [mode]);

  const onChangeTableTransfer = (nextTargetKeys, direction, moveKeys) => {
    if (direction === "left") {
      let exc = [];
      console.log(initialTargetKeys);
      if (initialTargetKeys.length != 0)
        initialTargetKeys?.forEach((k) => {
          if (moveKeys.includes(k)) {
            exc.push(k);
          }
        });
      console.log(exc);
      if (exc.length != 0) {
        let title = 'Редактировать местоположение устройств "';
        if (exc.length == 1)
          title = 'Редактировать местоположение устройства "';
        for (let i = 0; i < exc.length; i++) {
          title += exc[i];
          if (i == exc.length - 1) title += '"';
          else title += '", "';
        }
        setMoveExcDevices(exc);
        setTitleDrawer(title);
        setMoveDevices(nextTargetKeys);
        showDefaultDrawer();
      } else {
        setTargetKeys(nextTargetKeys);
      }
    } else {
      setTargetKeys(nextTargetKeys);
    }
    console.log(targetKeys);
  };

  const leftTableColumns = [
    {
      title: "Инвентарный №",
      dataIndex: "inventoryNumber",
      id: "inventoryNumber",
      ...getColumnSearchProps("inventoryNumber"),
      sorter: (a, b) => a.inventoryNumber.localeCompare(b.inventoryNumber),
    },
    {
      title: "Модель",
      dataIndex: "deviceModel",
      id: "deviceModel",
      ...getColumnSearchProps("deviceModel"),
      sorter: (a, b) => a.deviceModel.localeCompare(b.deviceModel),
    },
    {
      title: "Тип",
      dataIndex: "deviceType",
      id: "deviceType",
      ...getColumnSearchProps("deviceType"),
      sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
    },
    {
      title: "Вид пользования",
      dataIndex: "useType",
      id: "useType",
      filters: [
        { text: "общее пользование", value: "общее пользование" },
        { text: "резерв", value: "резерв" },
        { text: "рабочее место", value: "рабочее место" },
      ],
      onFilter: (value, record) => record.useType === value,
      render: (t, r) => (
        <span>
          <Tag color="geekblue">{t}</Tag>
        </span>
      ),
    },
    {
      title: "Здание/Помещение/РМ",
      dataIndex: "location",
      id: "location",
      ...getColumnSearchProps("location"),
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
  ];
  const rightTableColumns = [
    {
      title: "Инвентарный №",
      dataIndex: "inventoryNumber",
      id: "inventoryNumber",
      ...getColumnSearchProps("inventoryNumber"),
      sorter: (a, b) => a.inventoryNumber.localeCompare(b.inventoryNumber),
    },
    {
      title: "Модель",
      dataIndex: "deviceModel",
      id: "deviceModel",
      ...getColumnSearchProps("deviceModel"),
      sorter: (a, b) => a.deviceModel.localeCompare(b.deviceModel),
    },
    {
      title: "Тип",
      dataIndex: "deviceType",
      id: "deviceType",
      ...getColumnSearchProps("deviceType"),
      sorter: (a, b) => a.deviceType.localeCompare(b.deviceType),
    },
  ];

  const expandedRowRender = (record) => {
    // console.log(record);
    let columns = [],
      data = [];
    if (record.inventoryNumber != null) {
      columns = [
        {
          title: "Дата и время установки",
          dataIndex: "dateOfInstallation",
          id: "dateOfInstallation",
          ...getColumnSearchProps("dateOfInstallation"),
          render: (t, r) =>
            r.dateOfInstallation
              ? moment(r.dateOfInstallation).format("DD/MM/YYYY hh:mm:ss")
              : "",
          sorter: (a, b) => {
            a = a.dateOfInstallation || "";
            b = b.dateOfInstallation || "";
            a.localeCompare(b);
          },
        },
        {
          title: "Вид пользования",
          dataIndex: "useType",
          id: "useType",
          filters: [
            { text: "общее пользование", value: "общее пользование" },
            { text: "резерв", value: "резерв" },
            { text: "рабочее место", value: "рабочее место" },
          ],
          onFilter: (value, record) => record.useType === value,
          render: (t, r) => (
            <span>
              <Tag color="geekblue">{t}</Tag>
            </span>
          ),
        },

        {
          title: "Здание/Помещение/РМ",
          dataIndex: "location",
          id: "location",
          ...getColumnSearchProps("location"),
          sorter: (a, b) => a.location.localeCompare(b.location),
        },
        {
          title: "Дата снятия",
          dataIndex: "dateOfRemoval",
          id: "dateOfRemoval",
          ...getColumnSearchProps("dateOfRemoval"),
          render: (t, r) =>
            r.dateOfRemoval
              ? moment(r.dateOfRemoval).format("DD/MM/YYYY hh:mm:ss")
              : "",
          sorter: (a, b) => {
            a = a.dateOfRemoval || "";
            b = b.dateOfRemoval || "";
            a.localeCompare(b);
          },
        },
      ];
      console.log(record);

      locations?.forEach((l) => {
        l.deviceTransfers.forEach((dt) => {
          if (dt.device.inventoryNumber == record.inventoryNumber)
            data.push({
              key: dt.id,
              dateOfInstallation: dt.dateOfInstallation,
              useType: dt.useType,
              location: l.house + "/" + l.room,
              dateOfRemoval: dt.dateOfRemoval,
            });
        });
      });

      allWorkstations?.forEach((w) => {
        w.deviceTransfers.forEach((dt) => {
          if (dt.device.inventoryNumber == record.inventoryNumber) {
            let location = "";
            locations?.forEach((l) => {
              l.workstationTransfers.forEach((wt) => {
                if (wt.dateOfRemoval == null)
                  if (wt.idWorkstation == w.id) location = l;
              });
            });

            data.push({
              key: dt.id,
              dateOfInstallation: dt.dateOfInstallation,
              useType: dt.useType,
              location:
                location.house + "/" + location.room + "/" + w.registerNumber,
              dateOfRemoval: dt.dateOfRemoval,
            });
          }
        });
      });
    }
    if (record.registerNumber != null) {
      columns = [
        {
          title: "Дата и время установки",
          dataIndex: "dateOfInstallation",
          id: "dateOfInstallation",
          ...getColumnSearchProps("dateOfInstallation"),
          render: (t, r) =>
            r.dateOfInstallation
              ? moment(r.dateOfInstallation).format("DD/MM/YYYY hh:mm:ss")
              : "",
          sorter: (a, b) => {
            a = a.dateOfInstallation || "";
            b = b.dateOfInstallation || "";
            a.localeCompare(b);
          },
        },

        {
          title: "Здание/Помещение/РМ",
          dataIndex: "location",
          id: "location",
          ...getColumnSearchProps("location"),
          sorter: (a, b) => a.location.localeCompare(b.location),
        },
        Table.EXPAND_COLUMN,
        {
          title: "Отвественный",
          dataIndex: "employee",
          id: "employee",
          ...getColumnSearchProps("employee"),
          sorter: (a, b) => a.employee.localeCompare(b.employee),
        },
        {
          title: "Дата и время снятия",
          dataIndex: "dateOfRemoval",
          id: "dateOfRemoval",
          ...getColumnSearchProps("dateOfRemoval"),
          render: (t, r) =>
            r.dateOfRemoval
              ? moment(r.dateOfRemoval).format("DD/MM/YYYY hh:mm:ss")
              : "",
          sorter: (a, b) => {
            a = a.dateOfRemoval || "";
            b = b.dateOfRemoval || "";
            a.localeCompare(b);
          },
        },
      ];

      console.log(record);
      if (record.workstationTransfers)
        record.workstationTransfers.forEach((wt) => {
          let location, employee;
          locations.forEach((l) => {
            if (wt.idLocation == l.id) location = l.house + "/" + l.room;
          });
          employees.forEach((e) => {
            if (wt.idEmployee == e.id) employee = e;
          });
          data.push({
            key: wt.id,
            dateOfInstallation: wt.dateOfInstallation,
            dateOfRemoval: wt.dateOfRemoval,
            location: location,
            employee: employee?.personnelNumber,
            description:
              employee?.department +
              ": " +
              employee?.position +
              " " +
              employee?.lastName +
              " " +
              employee?.firstName +
              " " +
              employee?.patronymic,
          });
        });
    }
    return record.registerNumber != null ? (
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: (record) => {
            if (record.employee)
              return <p style={{ margin: 0 }}>{record.description}</p>;
            else
              return (
                <p style={{ margin: 0 }}>
                  Ответственный за рабочее место не определен
                </p>
              );
          },
        }}
        bordered
        dataSource={data}
        pagination={true}
      />
    ) : (
      <Table columns={columns} bordered dataSource={data} pagination={true} />
    );
  };

  const [isDefaultEmpty, setIsDefaultEmpty] = useState(true);

  return (
    <>
      <Layout>
        <Sider theme="light">
          <div>
            <Search
              style={{ marginBottom: 8 }}
              onChange={onChange}
              placeholder="Поиск"
            />
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={loop(treeData)}
              showLine={{ hideLeafIcon: true }}
              showIcon={false}
              onSelect={onSelect}
              style={{ marginBottom: 16, minWidth: 200 }}
            />
          </div>
        </Sider>

        <Content style={{ paddingLeft: 20, backgroundColor: "white" }}>
          {!isDefaultEmpty && !isEditWS && (
            <div>
              <Button
                type="primary"
                onClick={showAddModalWS}
                style={{ marginBottom: 8 }}
              >
                Добавить рабочее место
              </Button>
              {detailsLocations && (
                <Table
                  pagination={false}
                  bordered
                  columns={columnsParameters}
                  dataSource={dataWorkstations}
                  scroll={{ x: 800 }}
                  expandable={{ expandedRowRender }}
                ></Table>
              )}
            </div>
          )}
          {!isDefaultEmpty && isEditWS && (
            <Descriptions
              title={"Информация о рабочем месте " + editWS.registerNumber}
            >
              <Descriptions.Item label="Регистрационный №">
                {editWS.registerNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Сетевое имя">
                {editWS.networkName}
              </Descriptions.Item>
              <Descriptions.Item label="IP-адрес">
                {editWS.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Дата установки">
                {editWS.wt.dateOfInstallation}
              </Descriptions.Item>
              <Descriptions.Item label="Ответственный">
                {editWS.wt.employee
                  ? editWS.wt.employee.personnelNumber +
                    " " +
                    editWS.wt.employee.department +
                    " " +
                    editWS.wt.employee.position +
                    " " +
                    editWS.wt.employee.lastName +
                    " " +
                    editWS.wt.employee.firstName +
                    " " +
                    editWS.wt.employee.patronymic
                  : "не назначен"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Content>
      </Layout>
      {!isDefaultEmpty && (
        <>
          {detailsLocations && (
            <div>
              {isEditWS && (
                <Button
                  type="primary"
                  onClick={() => showEditModal(editWS.id)}
                  style={{ marginBottom: 8 }}
                >
                  Редактировать рабочее место
                </Button>
              )}
              <Table
                scroll={{ x: 800 }}
                bordered
                columns={columnsDevices}
                dataSource={dataDevices}
                expandable={{ expandedRowRender }}
                style={{ marginTop: 16 }}
              ></Table>
            </div>
          )}
        </>
      )}

      {!detailsLocations && !getMock && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
      <Modal
        forceRender
        title={!mode ? "Добавить рабочее место" : "Редактировать рабочее место"}
        visible={visibleWS}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <>
          <Form
            {...formItemLayout}
            form={form}
            scrollToFirstError
            name="formName"
            onFinish={onSubmit}
            ref={(val) => (window.formRef = val)}
          >
            <Form.Item
              label="Регистрационный №"
              name="registerNumber"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите регистрационный №!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Сетевое имя"
              name="networkName"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите сетевое имя!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="IP-адрес"
              name="IpAddress"
              initialValue={editWS?.ipAddress}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите ip-адрес!",
                },
              ]}
            >
              <MaskedInput mask={DUMB_IP_MASK} />
            </Form.Item>

            <Form.Item
              name="location"
              label="Местоположение"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, укажите местоположение!",
                },
              ]}
            >
              <Cascader
                options={treeLocationsData}
                showSearch={{ filter }}
              ></Cascader>
            </Form.Item>

            <Form.Item name="responsible" label="Ответственный">
              <Select
                notFoundContent="Сотрудники не найдены"
                showSearch
                placeholder="Укажите ответственного за рабочее место"
                optionFilterProp="children"
                value={employees}
                allowClear
              >
                {employees?.map((e: T) => (
                  <Select.Option value={e.id} key={e.id}>
                    {e.personnelNumber} {e.lastName} {e.firstName}{" "}
                    {e.patronymic} {e.department} {e.position}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Набор устройств" name="setOfDevices">
              {locations && (
                <TableTransfer
                  dataSource={dataTransferDevices}
                  targetKeys={targetKeys}
                  disabled={false}
                  showSearch={true}
                  onChange={onChangeTableTransfer}
                  filterOption={(inputValue, item) =>
                    item.inventoryNumber.indexOf(inputValue) !== -1 ||
                    item.deviceModel.indexOf(inputValue) !== -1 ||
                    item.deviceType.indexOf(inputValue) !== -1 ||
                    item.useType.indexOf(inputValue) !== -1 ||
                    item.location.indexOf(inputValue) !== -1
                  }
                  leftColumns={leftTableColumns}
                  rightColumns={rightTableColumns}
                />
              )}

              <Drawer
                title={titleDrawer}
                placement="right"
                onClose={onCloseDrawer}
                visible={visibleDrawer}
                width={600}
                extra={
                  <Space>
                    <Button onClick={onCloseDrawer}>Отмена</Button>
                    <Button
                      type="primary"
                      disabled={isLocationDrawer == ""}
                      onClick={onSubmitDrawer}
                    >
                      Подтвердить
                    </Button>
                  </Space>
                }
              >
                <Form form={formDrawer} layout="vertical">
                  <Form.Item
                    name="useType"
                    label="Вид пользования"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, укажите вид пользования!",
                      },
                    ]}
                  >
                    <Radio.Group style={{ marginLeft: 10 }}>
                      <Space direction="vertical" onChange={changeCascader}>
                        <Radio value={1}>Общее пользование</Radio>
                        <Radio value={2}>Резерв</Radio>
                        <Radio value={3}>Рабочее место</Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  {modeCascader && (
                    <Form.Item
                      name="location"
                      label="Местоположение"
                      rules={[
                        {
                          required: true,
                          message: "Пожалуйста, укажите местоположение!",
                        },
                      ]}
                    >
                      <Cascader
                        options={treeLocationDevicesData}
                        disabled={disabledCascader}
                        showSearch={{ filter }}
                        onChange={onChangeLocationDrawer}
                      ></Cascader>{" "}
                    </Form.Item>
                  )}

                  {!modeCascader && (
                    <Form.Item
                      name="locationWS"
                      label="Местоположение"
                      rules={[
                        {
                          required: true,
                          message: "Пожалуйста, укажите местоположение!",
                        },
                      ]}
                    >
                      <Cascader
                        options={treeLocationDevicesWSData}
                        disabled={disabledCascader}
                        showSearch={{ filter }}
                        onChange={onChangeLocationDrawer}
                      ></Cascader>{" "}
                    </Form.Item>
                  )}
                </Form>
              </Drawer>
            </Form.Item>

            {/* <div className="form-group">
                        <button type="submit" disabled={confirmLoading} className="btn btn-primary mr-2">
                            {confirmLoading && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Сохранить
                        </button>
                        <Link to="/users" className="btn btn-link">Отмена</Link>
                    </div> */}
          </Form>
        </>
      </Modal>
    </>
  );
}
