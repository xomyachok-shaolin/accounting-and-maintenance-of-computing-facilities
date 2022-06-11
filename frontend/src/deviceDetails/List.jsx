/* eslint-disable default-case */
import { useEffect, useState, useMemo } from "react";
import { useRecoilValue, useRecoilState } from "recoil";

import {
  useDeviceDetailActions,
  useDeviceTypeActions,
  useAlertActions,
  useLocationActions,
  useDeviceParameterActions,useWorkstationActions,
} from "_actions";
import {
  Form,
  Modal,
  Spin,
  Table,
  Input,
  Tag,
  Select,
  DatePicker,
  Descriptions,
  Typography,
  Space,
  Layout,
  Radio,
  Tree,
  Button,
  Cascader,
  Divider,
} from "antd";

import moment from "moment";

import {CSVLink} from "react-csv"

import { ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";

import {
  deviceDetailsAtom,
  deviceTypesAtom,
  locationsAtom,
  filterParametersAtom,
  filterDevicesAtom,deviceTransfersAtom, workstationTransfersAtom,
  deviceParametersAtom,flagUpdateAtom,
  selectedModelAtom,
} from "_state";
import React from "react";
import Search from "antd/lib/input/Search";

import Highlighter from "react-highlight-words";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

export { List };

function List({ match }) {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { Header, Footer, Sider, Content } = Layout;

  const { Paragraph } = Typography;

  const alertActions = useAlertActions();

  const [visible, setVisible] = useState(false);
  const [visibleParameter, setVisibleParameter] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const { confirm } = Modal;

  const deviceDetails = useRecoilValue(deviceDetailsAtom);
  const deviceTypes = useRecoilValue(deviceTypesAtom);
  const [filterParameters, setFilterParameters] =
    useRecoilState(filterParametersAtom);
  const [filterDevices, setFilterDevices] = useRecoilState(filterDevicesAtom);

  const locations = useRecoilValue(locationsAtom);
  const deviceParameters = useRecoilValue(deviceParametersAtom);

  const deviceParameterActions = useDeviceParameterActions();
  const deviceDetailActions = useDeviceDetailActions();
  const deviceTypeActions = useDeviceTypeActions();
  const locationActions = useLocationActions();
  const workstationActions = useWorkstationActions();

  const [selectedModel, setSelectedModel] = useRecoilState(selectedModelAtom);

  const [useMode, setUseMode] = useState(null);
  const workstationTransfers = useRecoilValue(workstationTransfersAtom);
  const deviceTransfers = useRecoilValue(deviceTransfersAtom);

  const [flagUpdate, setFlagUpdate] = useRecoilState(flagUpdateAtom);

  useEffect(() => {
    deviceTypeActions.getAll();
    locationActions.getAll();
    workstationActions.getAllWT();
    workstationActions.getAllDT();
    deviceParameterActions.getAll();

    return deviceDetailActions.resetDeviceDetails;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceTypeActions.getAll();
      locationActions.getAll();
      workstationActions.getAllWT();
      workstationActions.getAllDT();
      deviceParameterActions.getAll();

      setIsResetAll(false);
    }
  }, [isResetAll]);


  useEffect(() => {
    if (deviceTransfers != null && workstationTransfers!= null)
    if (deviceTransfers.status == true && workstationTransfers.status == true) {
      deviceDetailActions.getAll();
      setFlagUpdate(null);
    }
  }, [flagUpdate]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [isDefaultEmpty, setIsDefaultEmpty] = useState(true);

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
          dataIndex == "useType") && (
          <Input
            // ref={ searchInput }
            placeholder={`Поиск по ${
              dataIndex == "inventoryNumber"
                ? "инвентарному №"
                : dataIndex == "location"
                ? "модели"
                : dataIndex == "deviceModel"
                ? "местоположению"
                : dataIndex == "useType"
                ? "типу пользования"
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
          dataIndex == "dateOfDebit" ||
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
          {dataIndex != "dateOfLastService" &&
            dataIndex != "dateOfNextService" &&
            dataIndex != "dateOfDebit" &&
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
      if (
        dataIndex == "dateOfLastService" ||
        dataIndex == "dateOfNextService" ||
        dataIndex == "dateOfDebit"
      )
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
      title: "Вид пользования",
      dataIndex: "useType",
      id: "useType",
      filters: [
        { text: "общее пользование", value: "общее пользование" },
        { text: "резерв", value: "резерв" },
        { text: "рабочее место", value: "рабочее место" },
      ],
      onFilter: (value, record) => record.useType === value,
      render: (t, r) =>
        r.dateOfDebit == null ? (
          <span>
            <Tag color="geekblue">{t}</Tag>
          </span>
        ) : (
          <span>
            <Tag color="volcano">списано</Tag>
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
          ? moment(r.dateOfLastService).format("DD/MM/YYYY")
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
          ? moment(r.dateOfNextService).format("DD/MM/YYYY")
          : "",
      sorter: (a, b) => {
        a = a.dateOfNextService || "";
        b = b.dateOfNextService || "";
        a.localeCompare(b);
      },
    },
    {
      title: "Дата списания",
      key: "dateOfDebit",
      id: "dateOfDebit",
      ...getColumnSearchProps("dateOfDebit"),
      render: (t, r) =>
        r.dateOfDebit ? moment(r.dateOfDebit).format("DD/MM/YYYY") : "",
      sorter: (a, b) => {
        a = a.dateOfDebit || "";
        b = b.dateOfDebit || "";
        a.localeCompare(b);
      },
    },
    {
      title: "",
      key: "action",
      render: (text, record) =>
        record.dateOfDebit == null && (
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

  const columnsParameters = [
    {
      title: 'Параметры модели "' + selectedModel?.deviceModel + '"',
      dataIndex: "name",
      id: "name",
    },
    {
      title: "Описание",
      dataIndex: "description",
      id: "description",
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModalParameter(record.key)}>
            Редактировать
          </Button>
          <Button
            danger
            onClick={() => showDeleteModalParameter(record.name)}
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
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  const onSelect = (selectedKeys, info) => {
    setIsDefaultEmpty(false);

    var node = info.node;

    let tempKey = null;
    var devices = [];
    let regexp = /\d-\d-\d/;

    deviceDetails.forEach((dt) => {
      dt.deviceModels.forEach((dm) => {
        if (regexp.test(node.pos)) {
          if (dm.id == node.key) {
            setSelectedModel({
              id: dm.id,
              deviceModel: dm.name,
              deviceType: dt.name,
              dm: dm,
            });
            tempKey = dm;
          }
        } else {
          if (node.key == dt.name)
          setSelectedModel({
            deviceType: dt.name,
          });
        }

        dm.devices.forEach((device) => {
          const d = JSON.parse(JSON.stringify(device));
          d.deviceModel = dm.name;
          d.deviceType = dt.name;

          if (regexp.test(node.pos)) {
            if (dm.id == node.key) {
              devices.push(d);
            }
          } else {
            if (dt.name == node.key) {
              devices.push(d);
            }
          }
        });
      });
    });

    setFilterDevices(devices);

    var parameters = [];
    tempKey?.deviceParameterValues.forEach((dp) => {
      parameters.push({
        key: dp.deviceParameter.id,
        name: dp.deviceParameter.name,
        description: dp.value,
        deviceModel: selectedModel?.deviceModel,
        deviceType: selectedModel?.deviceType,
      });
    });

    setFilterParameters(parameters);

    console.log(devices);
  };

  const dataDevices = filterDevices?.map(function (row) {
    let useType,
      location = null;

    row.deviceTransfers.forEach((dt) => {
      if (dt?.dateOfRemoval == null) {
        if (dt?.useType == "рабочее место") {
          locations?.forEach((l) => {
            l.workstationTransfers.forEach((wt) => {
              if (wt.workstation.id == dt.idWorkstation)
                location =
                  l.house + "/" + l.room + "/" + wt.workstation.registerNumber;
            });
          });
        } else {
          locations?.forEach((l) => {
            if (l.id == dt?.idLocation) location = l.house + "/" + l.room;
          });
        }

        useType = dt?.useType;
      }
    });

    return {
      key: row.id,
      inventoryNumber: row.inventoryNumber,
      deviceModel: row.deviceModel,
      location: location,
      useType: useType,
      dateOfLastService: row.dateOfLastService,
      dateOfNextService: row.dateOfNextService,
      dateOfDebit: row.writtingOffAct?.dateOfDebit,
      deviceTransfers: row.deviceTransfers,
    };
  });

  const dataParameters = filterParameters?.map(function (row) {
    return {
      key: row.key,
      name: row.name,
      description: row.description,
      deviceModel: row.deviceModel,
      deviceType: row.deviceType,
    };
  });

  /* TREELIST */
  function details(path = "0", level = 1) {
    const list = [];
    deviceDetails?.forEach((dt) => {
      const key = `${dt.name}`;
      const treeNode = {
        title: dt.name,
        key,
      };
      if (dt.deviceModels) {
        const childrenList = [];
        dt.deviceModels.forEach((dm) => {
          const key = dm.id;
          const childrenNode = {
            title: dm.name,
            key,
            // icon: <SketchOutlined />,
          };
          childrenList.push(childrenNode);
        });
        treeNode.children = childrenList;
      }
      list.push(treeNode);
    });
    return list;
  }

  const treeData = details();

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

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: string[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

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

  const onChange = (e) => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data) =>
    data.map((item) => {
      const strTitle = item.title;
      const index = strTitle.indexOf(searchValue);
      const beforeStr = strTitle.substring(0, index);
      const afterStr = strTitle.slice(index + searchValue.length);
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

  /* TREESELECT */
  function detailsLocations() {
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

  function detailsLocationsWS() {
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
          if (useMode == 3) {
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

  const treeLocationsData = detailsLocations();
  const treeLocationsWSData = detailsLocationsWS();

  const showModal = () => {
    setVisible(true);
  };
  const showModalParameter = () => {
    setVisibleParameter(true);
  };
  const showDeleteModal = (id) => {
    confirm({
      title: "Вы уверены что хотите удалить запись?",
      icon: <ExclamationCircleOutlined />,
      okText: "Да",
      cancelText: "Отмена",
      onOk() {
        deviceDetailActions.delete(id);
        setIsResetAll(true);
        alertActions.success("Информация об устройстве удалена");
      },
      onCancel() {},
    });
  };

  function showDeleteModalParameter(data) {
    confirm({
      title: "Вы уверены что хотите удалить запись?",
      icon: <ExclamationCircleOutlined />,
      okText: "Да",
      cancelText: "Отмена",
      onOk() {
        let info = {
          deviceParameter: data,
          deviceModel: selectedModel.id,
        };
        deviceParameterActions.deleteDeviceParameter(info).then(() => {
          setIsResetAll(true);
          alertActions.success("Значение параметра модели удалено");
        });
      },
      onCancel() {},
    });
  }
  const showEditModal = (id) => {
    dataDevices.forEach((dd) => {
      if (dd.key === id) {
        console.log(dd);
        if (dd.useType == "общее пользование") dd.useType = 1;
        if (dd.useType == "резерв") dd.useType = 2;
        if (dd.useType == "рабочее место") dd.useType = 3;
        form.setFieldsValue({
          deviceType: selectedModel.deviceType,
          inventoryNumber: dd.inventoryNumber,
          deviceModel: dd.deviceModel,
          location: dd.location,
          useType: dd.useType,
        });
        setMode(dd);
        showModal();
      }
    });
  };

  const showEditModalParameter = (id) => {
    filterParameters.forEach((p) => {
      console.log(p);
      if (p.key === id) {
        form1.setFieldsValue({
          deviceModel: selectedModel.deviceModel,
          deviceType: selectedModel.deviceType,
          deviceParameter: p.name,
          deviceParameterValue: p.description,
        });
        setMode(p);
        showModalParameter();
      }
    });
  };

  const showAddModalDevice = () => {
    setMode(false);
    showModal();
  };
  const showAddModalParameter = () => {
    setMode(false);
    console.log(selectedModel);
    form1.setFieldsValue({
      deviceModel: selectedModel.deviceModel,
      deviceType: selectedModel.deviceType,
    });
    showModalParameter();
  };

  function createDevice(data) {
    console.log(data);

    switch (data.useType) {
      case 1:
        data.isCommonUse = true;
        data.isReserve = false;
        data.location = data.location[1];
        break;
      case 2:
        data.isCommonUse = false;
        data.isReserve = true;
        data.location = data.location[1];
        break;
      case 3:
        data.isCommonUse = false;
        data.isReserve = false;
        data.location = data.location[2];
        break;
    }

    return deviceDetailActions.create(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Устройство добавлено");
    });
  }
  function createParameter(data) {
    console.log(data);
    return deviceParameterActions.createDeviceParameter(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Значение параметра модели добавлено");
    });
  }
  function updateDevice(id, data) {
    if (Array.isArray(data.location))
      switch (data.useType) {
        case 1:
          data.isCommonUse = true;
          data.isReserve = false;
          data.location = data.location[1];
          break;
        case 2:
          data.isCommonUse = false;
          data.isReserve = true;
          data.location = data.location[1];
          break;
        case 3:
          data.location = data.location[2];
          break;
      }
    else {
      data.location = -1;
      data.isCommonUse = false;
      data.isReserve = false;
    }
    if (
      typeof data.deviceType === "string" ||
      data.deviceType instanceof String
    )
      data.deviceType = -1;

    console.log(id, data);

    return deviceDetailActions.update(id, data).then(() => {
      setIsResetAll(true);

      alertActions.success("Информация об устройстве обновлена");
    });
  }
  function updateParameter(id, data) {
    filterParameters.forEach((p) => {
      if (p.name === data.deviceParameter) {
        data.deviceParameter = p.key;
      }
    });
    console.log(data);
    return deviceParameterActions.updateDeviceParameter(id, data).then(() => {
      setIsSubmit(true);
      setIsResetAll(true);

      alertActions.success("Значение параметра модели обновлено");
    });
  }
  function onSubmit(values) {
    setVisible(false);
    setDisabledCascader(true);
    form.resetFields();

    return !mode ? createDevice(values) : updateDevice(mode.key, values);
  }
  function onSubmitParameter(values) {
    setVisibleParameter(false);
    setDisabledCascader(true);
    form.resetFields();
    form1.resetFields();

    return !mode ? createParameter(values) : updateParameter(mode.key, values);
  }
  const handleCancel = () => {
    setVisible(false);
    setVisibleParameter(false);
    setDisabledCascader(true);
    form.resetFields();
    form1.resetFields();
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const [disabledCascader, setDisabledCascader] = useState(true);
  const [modeCascader, setModeCascader] = useState(true);

  function changeCascader(e) {
    form.setFieldsValue({
      location: "",
    });
    if (e.target.value == 3) setModeCascader(false);
    else setModeCascader(true);
    setUseMode(e.target.value);
    setDisabledCascader(false);
  }

  const expandedRowRender = (record) => {
    // console.log(record);
    const columns = [
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
    const data = [];
    record.deviceTransfers.forEach((dt) => {
      let location = "";
      if (dt.useType == "рабочее место") {
        locations?.forEach((l) => {
          l.workstationTransfers.forEach((wt) => {
            if (wt.workstation.id == dt.idWorkstation)
              location =
                l.house + "/" + l.room + "/" + wt.workstation.registerNumber;
          });
        });
      } else {
        locations?.forEach((l) => {
          if (l.id == dt.idLocation) location = l.house + "/" + l.room;
        });
      }
      data.push({
        key: dt.id,
        dateOfInstallation: dt.dateOfInstallation,
        useType: dt.useType,
        location: location,
        dateOfRemoval: dt.dateOfRemoval,
      });
    });
    return (
      <Table columns={columns} bordered dataSource={data} pagination={true} />
    );
  };

  return (
    <>
      {deviceDetails && (
        <>
          <Layout>
            <Sider theme="light">
              <div>
                <Search
                  style={{ marginBottom: 8 }}
                  onChange={onChange}
                  placeholder="Поиск"
                  allowClear
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
              {!isDefaultEmpty && (
                <>
                  {selectedModel?.dm && (
                    <div direction="vertical">
                      <Button
                        type="primary"
                        onClick={showAddModalParameter}
                        style={{ marginBottom: 8 }}
                      >
                        Добавить параметр
                      </Button>
                      {deviceDetails && (
                        <Table
                          pagination={false}
                          scroll={{ x: 400 }}
                          bordered
                          columns={columnsParameters}
                          dataSource={dataParameters}
                        ></Table>
                      )}
                    </div>
                  )}
                  {!selectedModel?.dm && (
                    <div direction="vertical">
                    <Space><Button
                        type="primary"
                        onClick={showAddModalDevice}
                        style={{ marginBottom: 8 }}
                      >
                        Добавить устройство
                      </Button>
                      {dataDevices && (<Button
                        type="primary"
                        style={{ marginBottom: 8 }}
                      >
                      <CSVLink
                      filename={"dataDevices.csv"}
                      data={dataDevices}
                      onClick={()=>{
                        alertActions.success("Файл загружен");
                      }}
                    >
                      Экспорт в CSV
                    </CSVLink>
                      </Button>)} 
                      </Space>
                      <Table
                        scroll={{ x: 800 }}
                        bordered
                        columns={columnsDevices}
                        dataSource={dataDevices}
                        expandable={{ expandedRowRender }}
                      ></Table>
                    </div>
                  )}
                </>
              )}
            </Content>
          </Layout>
          {!isDefaultEmpty && (
            <>
              {selectedModel?.dm && (
                <div direction="vertical">
                <Space><Button
                    type="primary"
                    onClick={showAddModalDevice}
                    style={{ marginBottom: 8 }}
                  >
                    Добавить устройство
                  </Button>{dataDevices && (<Button
                    type="primary"
                    style={{ marginBottom: 8 }}
                  >
                  <CSVLink
                  filename={"dataDevices.csv"}
                  data={dataDevices}
                  onClick={()=>{
                    alertActions.success("Файл загружен");
                  }}
                >
                  Экспорт в CSV
                </CSVLink>
                  </Button>)} 
                  </Space>
                  <Table
                    scroll={{ x: 800 }}
                    bordered
                    columns={columnsDevices}
                    dataSource={dataDevices}
                    expandable={{ expandedRowRender }}
                  ></Table>
                </div>
              )}
            </>
          )}
        </>
      )}
      {!deviceDetails && <Spin size="large" />}
      <Modal
        forceRender
        title={!mode ? "Добавить устройство" : "Редактировать устройство"}
        visible={visible}
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
          >
            <Form.Item
              name="deviceType"
              label="Тип устройства"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите тип устройства!",
                },
              ]}
            >
              <Select
                //defaultValue={selectedRoles?.map((r) => r.id)}
                value={deviceTypes}
              >
                {deviceTypes?.map((dt) => (
                  <Select.Option value={dt.id} key={dt.id}>
                    {dt.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Модель"
              name="deviceModel"
              disabled
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите модель устройства!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Инвентарный №"
              name="inventoryNumber"
              disabled
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите инвентарный №!",
                },
              ]}
            >
              <Input />
            </Form.Item>

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
              <Radio.Group>
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
                  options={treeLocationsData}
                  disabled={disabledCascader}
                  showSearch={{ filter }}
                ></Cascader>
              </Form.Item>
            )}
            {!modeCascader && (
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
                  options={treeLocationsWSData}
                  disabled={disabledCascader}
                  showSearch={{ filter }}
                ></Cascader>
              </Form.Item>
            )}
          </Form>
        </>
      </Modal>

      <Modal
        title={!mode ? "Добавить параметр" : "Редактировать параметр"}
        visible={visibleParameter}
        onOk={form1.submit}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <>
          <Form
            {...formItemLayout}
            form={form1}
            scrollToFirstError
            name="formName"
            onFinish={onSubmitParameter}
          >
            <Form.Item
              name="deviceType"
              label="Тип устройства"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите тип устройства!",
                },
              ]}
            >
              <Select
                //defaultValue={selectedRoles?.map((r) => r.id)}
                value={deviceTypes}
              >
                {deviceTypes?.map((dt) => (
                  <Select.Option value={dt.id} key={dt.id}>
                    {dt.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Модель"
              name="deviceModel"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите модель устройства!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="deviceParameter"
              label="Параметр"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите параметр устройства!",
                },
              ]}
            >
              <Select
                //defaultValue={selectedRoles?.map((r) => r.id)}
                value={deviceParameters}
              >
                {deviceParameters?.map((dt) => (
                  <Select.Option value={dt.id} key={dt.id}>
                    {dt.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Значение"
              name="deviceParameterValue"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите значение параметра!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
}
