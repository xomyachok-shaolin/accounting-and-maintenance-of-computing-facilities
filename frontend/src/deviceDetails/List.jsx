/* eslint-disable default-case */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import {
  useDeviceDetailActions,
  useDeviceTypeActions,
  useAlertActions,
  useLocationActions,
} from "_actions";
import {
  Form,
  Modal,
  Spin,
  Table,
  Tag,
  Input,
  Select,
  InputNumber,
  Space,
  Radio,
  Tree,
  Button,
  TreeSelect,
  Cascader,
} from "antd";

import { ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons";

import { deviceDetailsAtom, deviceTypesAtom, locationsAtom } from "_state";
import React from "react";
import Search from "antd/lib/input/Search";

import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const alertActions = useAlertActions();

  const [visible, setVisible] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const { confirm } = Modal;

  const deviceDetails = useRecoilValue(deviceDetailsAtom);
  const deviceTypes = useRecoilValue(deviceTypesAtom);

  const locations = useRecoilValue(locationsAtom);

  const deviceDetailActions = useDeviceDetailActions();
  const deviceTypeActions = useDeviceTypeActions();
  const locationActions = useLocationActions();

  const [useMode, setUseMode] = useState(null);

  useEffect(() => {
    deviceDetailActions.getAll();
    deviceTypeActions.getAll();
    locationActions.getAll();
    return deviceDetailActions.resetDeviceDetails;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceDetailActions.getAll();
      deviceTypeActions.getAll();
      locationActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getColumnSearchProps = dataIndex => ({
    
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
        
          // ref={ searchInput }
          placeholder={`Поиск по ${(dataIndex == 'inventoryNumber')?'инвентарному №':dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Искать
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сброс
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Фильтр
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const columnsDevices = [
    {
      title: "Инвентарный №",
      dataIndex: "inventoryNumber",
      id: "inventoryNumber",
      ...getColumnSearchProps('inventoryNumber'),
      sorter: (a, b) => a.inventoryNumber.localeCompare(b.inventoryNumber)
    },
    {
      title: "Здание/Помещение/РМ",
      dataIndex: "location",
      id: "location",
    },
    {
      title: "Вид пользования",
      dataIndex: "useType",
      id: "useType",
    },
    {
      title: "Дата последнего обслуживания",
      key: "dateOfLastService",
      id: "dateOfLastService",
      render: (t, r) => r.dateOfLastService,
    },
    {
      title: "Дата следующего обслуживания",
      key: "dateOfNextService",
      id: "dateOfNextService",
      render: (t, r) => r.dateOfNextService,
    },
    {
      title: "Дата списания",
      key: "dateOfDebit",
      id: "dateOfDebit",
      render: (t, r) => r.dateOfDebit,
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

  const columnsParameters = [
    {
      title: "Параметры модели",
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
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const [filterDevices, setFilterDevices] = useState([]);
  const [filterParameters, setFilterParameters] = useState([]);

  const [selectedRowKeys, setRowKeys] = useState([]);
  const onSelect = (selectedKeys: React.Key[], info) => {
    var node = info.node;

    let tempKey = null;
    var devices = [];
    let regexp = /\d-\d-\d/;
    if (regexp.test(node.pos)) {

      deviceDetails.forEach(dt => {

        dt.deviceModels.forEach(dm => {
          dm.devices.forEach(d => {
            if (d.idDeviceModel == node.key) {
              if (tempKey == null) tempKey = d.id;
              devices.push(d);
            }
          })
        });
      });
    }

    setFilterDevices(devices);

    var parameters = [];
    if (tempKey != null) {
      setRowKeys([tempKey]);
      if (devices.length != 0) {
        devices[0].deviceParameterValues.forEach((dp) => {
          parameters.push({
            key: dp.deviceParameter.id,
            name: dp.deviceParameter.name,
            description: dp.value,
          });
        });
      }
    }
    setFilterParameters(parameters);

    console.log(devices);
  };

  const dataDevices = filterDevices?.map(function (row) {
    let useType = row.deviceTransfers[0].useType;
    let location =
      useType == "рабочее место"
        ? row.deviceTransfers[0].workstation.workstationTransfers[0].location
            .house +
          "/" +
          row.deviceTransfers[0].workstation.workstationTransfers[0].location
            .room +
          "/" +
          row.deviceTransfers[0].workstation.registerNumber
        : row.deviceTransfers[0].location.house +
          "/" +
          row.deviceTransfers[0].location.room;
    return {
      key: row.id,
      inventoryNumber: row.inventoryNumber,
      location: location,
      useType: useType,
      dateOfLastService: row.dateOfLastService,
      dateOfNextService: row.dateOfNextService,
      dateOfDebit: row.dateOfDebit,
    };
  });

  const dataParameters = filterParameters?.map(function (row) {
    return {
      key: row.key,
      name: row.name,
      description: row.description,
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
      if (level > 0) {
        if (dt.deviceModels) {
          const childrenList = [];
          dt.deviceModels.forEach((dm) => {
            const key = `${dm.id}`;
            const childrenNode = {
              title: dm.name,
              key,
              // icon: <SketchOutlined />,
            };
            childrenList.push(childrenNode);
          });
          treeNode.children = childrenList;
        }
      }
      list.push(treeNode);
    });

    return list;
  }

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

          if (useMode == 3) {
            const childrenListWS = [];
            r.ws.forEach((w) => {
              const childrenNodeWS = {
                label: "РМ " + w.workstation.registerNumber,
                value: w.workstation.id,
              };
              childrenListWS.push(childrenNodeWS);
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

  const treeData = details();
  const treeLocationsData = detailsLocations();

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
      dataList.push({ key, title: key });
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

  function updateDevice(id, data) {
    //data.imageFile = avatar.imageFile;
    return deviceTypeActions.update(id, data).then(() => {
      setIsResetAll(true);
      alertActions.success("Информация об устройстве обновлена");
    });
  }
  function onSubmit(values) {
    setVisible(false);
    setDisabledCascader(true);

    return !mode ? createDevice(values) : updateDevice(mode.id, values);
  }

  const handleCancel = () => {
    setVisible(false);
    setDisabledCascader(true);
    form.resetFields();
  };

  function filter(inputValue, path) {
    return path.some(
      (option) =>
        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  }

  const [disabledCascader, setDisabledCascader] = useState(true);

  function changeCascader(e) {
    setUseMode(e.target.value);
    setDisabledCascader(false);
  }

  const onSelectChange = (selectedRowKeys) => {
    setRowKeys(selectedRowKeys);

    var parameters = [];
    if (filterDevices.length != 0) {
      filterDevices.forEach((d) => {
        if (d.id == selectedRowKeys[0]) {
          d.deviceParameterValues.forEach((dp) => {
            parameters.push({
              key: dp.deviceParameter.id,
              name: dp.deviceParameter.name,
              description: dp.value,
            });
          });
        }
      });
    }
    setFilterParameters(parameters);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <Space>
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
            style={{ marginBottom: 16 }}
          />
        </div>
        <div>
          <Button
            type="primary"
            onClick={showAddModalDevice}
            style={{ marginBottom: 8 }}
          >
            Добавить параметр
          </Button>
          {deviceDetails && (
            <Table
              pagination={false}
              locale={{ emptyText: "Нет данных" }}
              bordered
              columns={columnsParameters}
              dataSource={dataParameters}
            ></Table>
          )}
        </div>
      </Space>
      {deviceDetails && (
        <div>
          <Button
            type="primary"
            onClick={showAddModalDevice}
            style={{ marginBottom: 8 }}
          >
            Добавить устройство
          </Button>
          <Table
            scroll={{ x: 800 }}
            locale={{ emptyText: "Нет данных" }}
            bordered
            columns={columnsDevices}
            dataSource={dataDevices}
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            showSorterTooltip={{ title: 'Нажмите для сортировки' }}
          ></Table>
        </div>
      )}

      {!deviceDetails && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
      <Modal
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
