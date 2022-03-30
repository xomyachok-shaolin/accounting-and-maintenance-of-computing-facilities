/* eslint-disable react/react-in-jsx-scope */
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authAtom, adminAtom, collapseAtom } from "_state";
import { useUserActions } from "_actions";

import { Button, Descriptions, Divider, Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FilterOutlined,
  ControlOutlined,
  CompassOutlined,
  FileOutlined,
  SettingOutlined,
  StarOutlined,
  PoweroffOutlined,
  HomeOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";

import { Space } from "antd";
import { Avatar } from "antd";
import { Image } from "antd";
import Title from "antd/lib/typography/Title";
import { Link } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

export { Nav };

function Nav() {
  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();

  const isAdmin = useRecoilValue(adminAtom);
  const collapsed = useRecoilValue(collapseAtom);

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
        <Space>
          <Avatar
            style={{ marginLeft: 25, marginTop: 15 }}
            src={
              <Image
                src="https://joeschmoe.io/api/v1/random"
                style={{ width: 32 }}
              />
            }
          />
          {!collapsed && (
            <Title style={{ marginLeft: 10, marginTop: 25 }} level={5}>
              {auth.username}
            </Title>
          )}
        </Space>
        <Divider />
        <Menu.Item key="0" icon={<HomeOutlined />}>
          <NavLink exact to="/">
            Главная
          </NavLink>
        </Menu.Item>
        {!isAdmin && (
          <SubMenu
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
          </SubMenu>
        )}
        
        {!isAdmin && (<SubMenu key="sub3" icon={<BookOutlined />} title="Справочники">
          <Menu.Item key="3" icon={<CompassOutlined />}>
            <Link to="/locations">Местоположения</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FilterOutlined />}>
            <Link to="/deviceTypes">Виды устройств</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ControlOutlined />}>
            <Link to="/deviceParameters">Параметры устройств</Link>
          </Menu.Item>
        </SubMenu>
        )}

        <Menu.Item key="6" icon={<DesktopOutlined />}>
          <Link to="/deviceTypes">Виды устройств</Link>
        </Menu.Item>
        <SubMenu key="sub2" icon={<FileOutlined />} title="User">
          <Menu.Item key="7">Tom</Menu.Item>
          <Menu.Item key="8">Bill</Menu.Item>
          <Menu.Item key="9">Alex</Menu.Item>
        </SubMenu>
        <Menu.Item key="10" icon={<PoweroffOutlined />}>
          <Link to="" onClick={userActions.logout}>
            Выход
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>

    // <nav className="navbar navbar-expand navbar-dark bg-dark">
    //     <div className="navbar-nav">
    //         <NavLink exact to="/" className="nav-item nav-link">Главная</NavLink>
    //         {isAdmin && <NavLink to="/users" className="nav-item nav-link">Пользователи</NavLink>}
    //         <a onClick={userActions.logout} className="nav-item nav-link">Выход</a>
    //     </div>
    // </nav>
  );
}
