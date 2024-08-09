import UserContext from "../contexts/UserContext";
import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { decodeToken } from "react-jwt";
import LoggedIn from "../components/LoggedIn";
import Loading from "../components/Loading";
import { Input, Button, Form } from "antd";
const Login = () => {
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [form] = Form.useForm();
  const { userInfo, login } = useContext(UserContext);

  const handleLogin = (values) => {
    setIsProcessing(true);
    axios
      .post("/api/users/login", values)
      .then((response) => {
        const token = response.data.token;
        const expiresIn = response.data.expiresIn;
        const date = new Date();
        date.setTime(date.getTime() + expiresIn);
        Cookies.set("JWT", token, { expires: date });
        login({
          userId: decodeToken(Cookies.get("JWT")).UserId,
          role: decodeToken(Cookies.get("JWT")).Role,
        });
        history.goBack();
      })
      .catch((error) => {
        if (error.response.status === 404) {
          form.setFields([
            {
              name: "userLogin",
              errors: ["Ne postoji korisnik s tim imenom"],
            },
          ]);
        }
        if (error.response.status === 401) {
          form.setFields([
            {
              name: "password",
              errors: ["Pogrešna zaporka"],
            },
          ]);
        }
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  if (userInfo && userInfo.role === "GUEST")
    return (
      <div className="default-form">
        <h2>Prijava:</h2>
        <h4>Ne posjedujete račun?</h4>
        <Link to="/register">Kliknite ovdje za registraciju</Link>
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          name="form"
          onFinish={handleLogin}
        >
          <br></br>
          <Form.Item
            name="userLogin"
            label="Korisničko ime ili e-mail:"
            required
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Unesite korisničko ime");
                  }
                },
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            name="password"
            label="Lozinka:"
            required
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Unesite lozinku");
                  }
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isProcesing}>
            Prijava
          </Button>
        </Form>
      </div>
    );
  else if (userInfo && userInfo.role !== "GUEST") return <LoggedIn />;
  else return <Loading></Loading>;
};

export default Login;
