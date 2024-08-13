import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import Loading from "../components/Loading";
import Unauthorized from "./Unauthorized";
import { Tabs } from "antd";
import CategoryManagment from "../components/CategoryManagment";
import ImageManagment from "../components/ImageManagment";
import UserManagment from "../components/UserManagment";
const { TabPane } = Tabs;

const AdminPanel = () => {
  const { userInfo } = useContext(UserContext);

  if (userInfo && userInfo.role === "ADMIN")
    return (
      <div className="admin-panel">
        <div className="tight-row">
          <h1>ADMIN PANEL</h1>
        </div>
        <Tabs centered>
          <TabPane tab="Upravljanje korisnicima" key="1">
            <UserManagment></UserManagment>
          </TabPane>
          <TabPane tab="Upravljanje slikama" key="2">
            <ImageManagment></ImageManagment>
          </TabPane>
          <TabPane tab="Upravljanje kategorijama" key="3">
            <CategoryManagment></CategoryManagment>
          </TabPane>
        </Tabs>
      </div>
    );
  else if (userInfo && userInfo.role !== "ADMIN")
    return <Unauthorized></Unauthorized>;
  else return <Loading></Loading>;
};

export default AdminPanel;
