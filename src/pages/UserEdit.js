import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import { getJWT } from "../utils/utilities";
import { validateEmail } from "../utils/registrationValidator";
import Loading from "../components/Loading";
import Unauthorized from "./Unauthorized";
import { Button, Input, Form, Switch } from "antd";
import ImageUpload from "../components/ImageUpload";
import { toast } from "react-toastify";
const UserEdit = ({ id: propId }) => {
  const { userInfo } = useContext(UserContext);
  var { id } = useParams();
  if (id === undefined) {
    id = propId;
  }
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (userInfo && userInfo.role !== "GUEST") {
      axios
        .get("/api/users/personal/" + id, {
          headers: { Authorization: "Bearer " + getJWT() },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userInfo]);

  const handleSubmit = (values) => {
    setIsProcessing(true);
    const user = { ...values, id: id };
    axios
      .put("/api/users", user, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        if (propId === undefined) history.push("/users/" + id);
        else {
          toast.success("Uspješno izmjenjen profil", {
            toastId: 0,
            closeButton: false,
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.data.message === "Email taken")
          form.setFields([
            {
              name: "email",
              errors: ["E-mail je već u upotrebi"],
            },
          ]);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  if (
    userInfo &&
    user &&
    (userInfo.userId === user.id || userInfo.role === "ADMIN")
  )
    return (
      <div className="default-form">
        <h2>Uređivanje vašeg profila</h2>
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          name="form"
          initialValues={user}
          onFinish={handleSubmit}
        >
          <br></br>
          <Form.Item name="realName" label="Ime i prezime:">
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            style={{ textAlign: "right" }}
            name="showRealName"
            label="Prikaz imena na profilu"
            valuePropName="checked"
            layout="horizontal"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="email"
            label="e-mail:"
            rules={[
              {
                validator: (_, value) => {
                  if (!validateEmail(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(validateEmail(value));
                  }
                },
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            style={{ textAlign: "right" }}
            name="showEmail"
            label="Prikaz e-maila na profilu"
            valuePropName="checked"
            layout="horizontal"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="phone" label="Telefon:">
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            style={{ textAlign: "right" }}
            name="showPhone"
            label="Prikaz telefona na profilu"
            valuePropName="checked"
            layout="horizontal"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="about" label="O meni:">
            <Input.TextArea rows={5}></Input.TextArea>
          </Form.Item>

          <Form.Item
            label={"Profilna slika:"}
            name={"pictureId"}
            initialValue={1}
            rules={[
              {
                validator: (_, value) => {
                  if (!isNaN(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(value);
                  }
                },
              },
            ]}
          >
            <ImageUpload
              isProcessing={(e) => setIsProcessing(e)}
              currentImagePath={"/../../" + user.pathToPicture}
            ></ImageUpload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isProcesing}>
              Spremi promjene
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  else if (userInfo && userInfo.role === "GUEST")
    return <Unauthorized></Unauthorized>;
  else return <Loading></Loading>;
};

export default UserEdit;
