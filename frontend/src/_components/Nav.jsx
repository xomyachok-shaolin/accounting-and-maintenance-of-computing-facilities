/* eslint-disable react/react-in-jsx-scope */
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom, userRolesAtom, collapseAtom } from "_state";
import { useUserActions } from "_actions";

import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  ContainerOutlined,
  FilterOutlined,
  BuildOutlined,
  ControlOutlined,
  CompassOutlined,
  ReadOutlined,
  SettingOutlined,
  StarOutlined,
  PoweroffOutlined,
  HomeOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

const { Sider } = Layout;

export { Nav };

function Nav() {
  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();

  const userRoles = useRecoilValue(userRolesAtom);
  const collapsed = useRecoilValue(collapseAtom);

  // {userRoles?.filter((r) => r.name === "Администратор").length > 0 && (
  // console.log(userRoles);
  // only show nav when logged in
  if (!auth) return null;

  return (
    <Sider
      theme="light"
      style={{
        overflow: "auto",
        height: "100vh",
        margin: 7,
      }}
      width="250"
      collapsible
      collapsed={collapsed}
      onCollapse={userActions.switchMenu}
    >
      <Menu theme="light" defaultSelectedKeys={["0"]} mode="inline">
        <Menu.Item key="0" icon={<HomeOutlined />}>
          <NavLink exact to="/">
            Главная
          </NavLink>
        </Menu.Item>
                 <Menu.SubMenu
            key="sub1"
            icon={<SettingOutlined />}
            title="Администрирование"
          >
            <Menu.Item icon={<TeamOutlined />} key="1">
              <Link to="/users">Пользователи</Link>
            </Menu.Item>
            <Menu.Item icon={<StarOutlined />} key="2">
              <Link to="/roles">Роли</Link>
            </Menu.Item>
          </Menu.SubMenu>
        
      

              <Menu.SubMenu key="sub3" icon={<BookOutlined />} title="Справочники">
            <Menu.Item key="3" icon={<CompassOutlined />}>
              <Link to="/locations">Местоположения</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FilterOutlined />}>
              <Link to="/deviceTypes">Виды устройств</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<ControlOutlined />}>
              <Link to="/deviceParameters">Параметры устройств</Link>
            </Menu.Item>
          </Menu.SubMenu>
       

        <Menu.Item key="6" icon={<BuildOutlined />}>
          <Link to="/deviceDetails">Сведения об устройствах</Link>
        </Menu.Item>
        <Menu.Item key="7" icon={<DesktopOutlined />}>
          <Link to="/workstationDevices">Оборудование на РМ</Link>
        </Menu.Item>
        <Menu.Item key="8" icon={<ReadOutlined />}>
          <Link to="/tasks">Журнал задач</Link>
        </Menu.Item>
       <Menu.Item key="9" icon={<ContainerOutlined />}>
            <Link to="/writingOffActs">Акты списания</Link>
          </Menu.Item>
        <Menu.Item key="10" icon={<PoweroffOutlined />}>
          <Link to="" onClick={userActions.logout}>
            Выход
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}
