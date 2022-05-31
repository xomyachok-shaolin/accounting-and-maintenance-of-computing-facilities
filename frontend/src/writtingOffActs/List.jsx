/* eslint-disable default-case */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import { TableTransfer } from "./TableTransfer";
import { UploadCustom } from "./UploadCustom";

import {
  useDeviceDetailActions,
  useDeviceTypeActions,
  useAlertActions,
  useLocationActions,
  useWrittingOffActActions,
} from "_actions";
import {
  Form,
  Modal,
  Spin,
  Table,
  Input,
  Dropdown,
  Badge,
  DatePicker,
  Space,
  Radio,
  Tag,
  Button,
  Cascader,
} from "antd";

import moment from "moment";

import { ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";
import { writtingOffActAtom, writtingOffActsAtom } from "_state";
import {
  deviceDetailsAtom,
  avatarAtom,
  deviceTypesAtom,
  locationsAtom,
} from "_state";
import React from "react";

import Highlighter from "react-highlight-words";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const alertActions = useAlertActions();

  const [visible, setVisible] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const { confirm } = Modal;

  const writtingOffActs = useRecoilValue(writtingOffActsAtom);

  const locationActions = useLocationActions();
  const writtingOffActActions = useWrittingOffActActions();

  const [writtingOffAct, setWrittingOffAct] =
    useRecoilState(writtingOffActAtom);

  const locations = useRecoilValue(locationsAtom);

  useEffect(() => {
    writtingOffActActions.getAll();
    return writtingOffActActions.resetWrittingOffActs;
  }, []);

  useEffect(() => {
    locationActions.getAll();
    return locationActions.resetLocations;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      writtingOffActActions.getAll();
      locationActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

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
          dataIndex == "deviceModel" ||
          dataIndex == "location" ||
          dataIndex == "deviceType" ||
          dataIndex == "name" ||
          dataIndex == "useType") && (
          <Input
            // ref={ searchInput }
            placeholder={`Поиск по ${
              dataIndex == "inventoryNumber"
                ? "инвентарному №"
                : dataIndex == "location"
                ? "местоположению"
                : dataIndex == "name"
                ? "наименованию"
                : dataIndex == "deviceModel"
                ? "модели"
                : dataIndex == "useType"
                ? "виду пользования"
                : dataIndex == "deviceType"
                ? "тип устройства"
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
        {(dataIndex == "dateOfDebit") && (
          <DatePicker.RangePicker
            onChange={(date, dateString) => {
              setSelectedKeys(date ? [date] : []);
            }}
            placeholder={[`c`, `по`]}
            value={selectedKeys[0]}
            style={{ marginRight: 8, width: 250 }}
          />
        )}
        <Space>
          {dataIndex != "dateOfDebit" && (
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const expandedRowRender = (record) => {
    console.log(record);
    const columns = [
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
    const data = [];
    record.devices.forEach((device) => {
      data.push({
        key: device.inventoryNumber,
        inventoryNumber: device.inventoryNumber,
        deviceModel: device.deviceModel.name,
        deviceType: device.deviceModel.deviceType.name,
      });
    });
    return (
      <Table columns={columns} bordered dataSource={data} pagination={true} />
    );
  };

  const columnsDevices = [
    {
      title: "Наименование",
      dataIndex: "name",
      id: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: "Файлы",
      key: "files",
      dataIndex: "files",
      render: (files) => (
        <>
          {files?.map((file) => {
            var name = file.fileName;
            var link = file.file;
            var color = "geekblue";
            return (
              <Tag color={color} key={name}>
                <a href={link}>{name.toUpperCase()}</a>
              </Tag>
            );
          })}
        </>
      ),
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

  const [filterWorkstations, setfilterWorkstations] = useState([]);

  const [selectedRowKeys, setRowKeys] = useState([]);

  const dataWrittingOffActs = writtingOffActs?.map(function (row) {
    console.log(row);

    return {
      key: row.id,
      name: row.name,
      dateOfDebit: row.dateOfDebit,
      files: row.writtingOffActFiles,
      devices: row.devices,
    };
  });

  const showModal = () => {
    setVisible(true);
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
    // roles.forEach((role) => {
    //   if (role.id === id) {
    //     form.setFieldsValue({
    //       name: role.name,
    //       isWriteOff: role.isWriteOff,
    //       isTransfer: role.isTransfer,
    //       isUpgrade: role.isUpgrade,
    //       isEditWS: role.isEditWS,
    //       isEditTask: role.isEditTask,
    //     });
    //     setMode(role);
    //     showModal();
    //   }
    // });
  };

  const showAddModalDevice = () => {
    setMode(false);
    form.setFieldsValue({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      mail: "",
      patronymic: "",
      imageFile: "",
      imageName: "",
      roles: [],
    });
    showModal();
  };
  function createDevice(data) {
    data.files = writtingOffAct;
    console.log(data);

    return writtingOffActActions.create(data).then(() => {
      setIsResetAll(true);
      alertActions.success("Акт о списании добавлен");
    });
  }

  function updateDevice(id, data) {
    //data.imageFile = avatar.imageFile;
    return writtingOffActActions.update(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация об акте списании обновлена");
    });
  }
  function onSubmit(values) {
    setVisible(false);

    return !mode ? createDevice(values) : updateDevice(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const dateFormat = "YYYY/MM/DD";

  const [filterDevices, setFilterDevices] = useState([]);

  var devices = [];
  if (filterDevices.length == 0)
    locations?.forEach((l) => {
      l.workstationTransfers[0]?.workstation.deviceTransfers.forEach((dt) => {
        let device = JSON.parse(JSON.stringify(dt.device));
        device.useType = dt.useType;
        device.location = l;
        device.workstation = l.workstationTransfers[0]?.workstation;
        if (device.workstation != null) {
          devices.push(device);
          setFilterDevices(devices);
        }
      });
      l.deviceTransfers.forEach((dt) => {
        let device = JSON.parse(JSON.stringify(dt.device));
        device.useType = dt.useType;
        device.location = l;
        device.workstation = l.workstationTransfers[0]?.workstation;

        if (device.location != null) {
          devices.push(device);
          setFilterDevices(devices);
        }
      });
    });

  const dataTransferDevices = Array.from(filterDevices)?.map(function (row) {
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

  const originTargetKeys = dataTransferDevices;

  const [targetKeys, setTargetKeys] = useState(originTargetKeys);

  const onChangeTableTransfer = (nextTargetKeys) => {
    setTargetKeys(nextTargetKeys);
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

  return (
    <>
      {writtingOffActs && (
        <div>
          <Button
            type="primary"
            onClick={showAddModalDevice}
            style={{ marginBottom: 8 }}
          >
            Добавить акт списания
          </Button>
          <Table
            scroll={{ x: 800 }}
            bordered
            columns={columnsDevices}
            dataSource={dataWrittingOffActs}
            expandable={{ expandedRowRender }}
          ></Table>
        </div>
      )}

      {!writtingOffActs && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
      <Modal
        title={!mode ? "Добавить акт списания" : "Редактировать акт списания"}
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
              label="Наименование"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите наименование",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Дата списания"
              name="dateOfDebit"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, укажите дату списания",
                },
              ]}
            >
              <DatePicker format={dateFormat} />
            </Form.Item>

            <Form.Item label="Файл">
              <UploadCustom />
            </Form.Item>

            <Form.Item
              label="Списанные устройства"
              name="decommissionedDevices"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, укажите списанные устройства",
                },
              ]}
            >
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
