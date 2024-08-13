import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../contexts/UserContext";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/registrationValidator";
import LoggedIn from "../components/LoggedIn";
import Loading from "../components/Loading";
import { Button, Input, Form } from "antd";
import ImageUpload from "../components/ImageUpload";

const Register = () => {
  const { userInfo } = useContext(UserContext);
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    axios
      .post("/api/users/register", values, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        if (error.response.data.message === "Username taken") {
          form.setFields([
            {
              name: "username",
              errors: ["Korisničko ime je već zauzeto"],
            },
          ]);
        }
        if (error.response.data.message === "Email taken") {
          form.setFields([
            {
              name: "email",
              errors: ["E-mail je već u upotrebi"],
            },
          ]);
        }
        console.log(error);
      });
  };

  if (userInfo && userInfo.role === "GUEST")
    return (
      <div className="default-form">
        <h2>Kreiranje novog korisničkog profila:</h2>
        <h4>Već posjedujete račun?</h4>
        <Link to="/login" replace={true}>
          Kliknite ovdje za prijavu
        </Link>
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          name="form"
          onFinish={handleSubmit}
        >
          <br></br>
          <Form.Item
            name="username"
            label="Korisničko ime:"
            required
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (!validateUsername(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(validateUsername(value));
                  }
                },
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail:"
            required
            hasFeedback
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
            <Input type="email" />
          </Form.Item>

          <Form.Item name="realName" label="Ime:" required={false}>
            <Input type="name" />
          </Form.Item>

          <Form.Item name="phone" label="Broj telefona:" required={false}>
            <Input type="tel" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Lozinka:"
            required
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (!validatePassword(value)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(validatePassword(value));
                  }
                },
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="repeatPassword"
            label="Ponovi lozinku:"
            dependencies={["password"]}
            required
            hasFeedback
            rules={[
              {
                required: true,
                message: "Molimo ponovite lozinku",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Lozinke se ne podudaraju");
                },
              }),
            ]}
          >
            <Input.Password />
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
            <ImageUpload isProcessing={(e) => setIsProcessing(e)}></ImageUpload>
          </Form.Item>

          <p>
            Polja označena sa <span style={{ color: "red" }}>*</span> su
            obavezna
          </p>
          <br></br>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isProcesing}>
              Registriraj se
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  else if (userInfo && userInfo.role !== "GUEST") return <LoggedIn />;
  else return <Loading></Loading>;
};

export default Register;
