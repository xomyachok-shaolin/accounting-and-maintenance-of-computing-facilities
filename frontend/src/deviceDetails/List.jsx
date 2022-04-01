import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue, useRecoilState, DefaultValue } from "recoil";

import {
  useDeviceDetailActions,
  useDeviceTypeActions,
  useAlertActions,
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
} from "antd";

import { SketchOutlined, FormOutlined } from "@ant-design/icons";

import { deviceDetailsAtom, deviceTypesAtom } from "_state";
import React from "react";
import Search from "antd/lib/input/Search";
import Checkbox from "antd/lib/checkbox/Checkbox";
const { Option } = Select;

export { List };

function List({ match }) {
  const [form] = Form.useForm();

  const alertActions = useAlertActions();

  const [loading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [confirmLoading] = useState(false);

  const [mode, setMode] = useState(false);
  const [isResetAll, setIsResetAll] = useState(false);

  const { confirm } = Modal;

  const deviceDetails = useRecoilValue(deviceDetailsAtom);
  const deviceTypes = useRecoilValue(deviceTypesAtom);

  const deviceDetailActions = useDeviceDetailActions();
  const deviceTypeActions = useDeviceTypeActions();

  useEffect(() => {
    deviceDetailActions.getAll();
    deviceTypeActions.getAll();
    return deviceDetailActions.resetDeviceDetails;
  }, []);

  useEffect(() => {
    if (isResetAll) {
      deviceDetailActions.getAll();
      deviceTypeActions.getAll();
      setIsResetAll(false);
    }
  }, [isResetAll]);

  const columnsDevices = [
    {
      title: "Инвентарный №",
      dataIndex: "inventoryNumber",
      id: "inventoryNumber",
    },
    {
      title: "Серийный №",
      dataIndex: "serialNumber",
      id: "serialNumber",
    },
    {
      title: "Здание/Помещение",
      dataIndex: "location",
      id: "location",
    },
    {
      title: "Общего пользования",
      key: "isCommonUse",
      render: (t, r) => <Checkbox checked={r.isCommonUse}> </Checkbox>,
    },
    {
      title: "Резерв",
      key: "isReserve",
      render: (t, r) => <Checkbox checked={r.isCommonUse}> </Checkbox>,
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

  const onSelect = (selectedKeys: React.Key[], info) => {
    var node = info.node;

    var devices = [];
    let regexp = /\d-\d-\d/;
    if (regexp.test(node.pos)) {
      deviceDetails.forEach((d) => {
        if (d.idDeviceModel == node.key)
        devices.push(d);
      });
    }


    var parameters = [];
    if(devices.length != 0) {
      devices[0].deviceModel.deviceProperties.forEach((dp)=>{
        parameters.push({
          name: dp.deviceParameter.name, 
          description: dp.description
        });
      });

      console.log(filterParameters)
      setFilterParameters(parameters);
    }

    setFilterDevices(devices);
    console.log(devices);
  };

  const dataDevices = filterDevices?.map(function (row) {
    return {
      key: row.id,
      inventoryNumber: row.inventoryNumber,
      serialNumber: row.serialNumber,
      location: row.location,
      isCommonUse: row.isCommonUse,
      isReserve: row.isReserve,
    };
  });

  const dataParameters = filterParameters?.map(function (row) {
    return {
      key: row.id,
      name: row.name,
      description: row.description,
    };
  });

  function details(path = "0", level = 1) {
    const list = [];
    deviceTypes?.forEach((dt) => {
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

  const treeData = details();

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
          />
        </div>

        {deviceDetails && (
          <Table bordered columns={columnsParameters} dataSource={dataParameters}></Table>
        )}
      </Space>

      {deviceDetails && (
        <Table bordered columns={columnsDevices} dataSource={dataDevices}></Table>
      )}

      {!deviceDetails && (
        <div className="text-center p-3">
          <Spin size="large" />
        </div>
      )}
    </>
  );
}
