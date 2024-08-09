import { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { useEffect } from "react";
import { getJWT } from "../utils/utilities";
import Loading from "../components/Loading";
import Unauthorized from "./Unauthorized";
import { Button, Input, Form, Checkbox } from "antd";
import ImageUpload from "../components/ImageUpload";
const RecipeCreate = () => {
  const { userInfo } = useContext(UserContext);
  const [allCategories, setAllCategories] = useState();
  const [isProcesing, setIsProcessing] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        const categories = response.data.map((category) => {
          return {
            label: category.name,
            value: category.id,
          };
        });
        setAllCategories(categories);
        console.log(categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (values) => {
    const recipe = { ...values, pictureIds: [values.pictureIds] };
    setIsProcessing(true);
    axios
      .post("/api/recipes", recipe, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then((response) => {
        history.push("/recipes/" + response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  if (userInfo && userInfo.role !== "GUEST")
    return (
      <div className="default-form">
        <h2>Dodaj novi recept</h2>
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          name="form"
          onFinish={handleSubmit}
        >
          <br></br>
          <Form.Item
            name="title"
            label="Naziv recepta:"
            hasFeedback
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Unesite naziv recepta");
                  }
                },
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>
          <Form.Item
            name="shortDescription"
            label="Kratki opis:"
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Unesite kratki opis");
                  }
                },
              },
            ]}
          >
            <Input type="text"></Input>
          </Form.Item>

          <Form.Item
            name="longDescription"
            label="Postupak:"
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Unesite postupak");
                  }
                },
              },
            ]}
          >
            <Input.TextArea type="text" rows={7}></Input.TextArea>
          </Form.Item>
          <Form.Item
            name="categories"
            label="Kategorije:"
            rules={[
              {
                validator: (_, value) => {
                  if (value !== undefined && value.length > 0) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject("Odaberite barem jednu kategoriju");
                  }
                },
              },
            ]}
          >
            <Checkbox.Group options={allCategories}></Checkbox.Group>
          </Form.Item>

          <Form.Item
            label={"Slika recepta:"}
            name={"pictureIds"}
            initialValue={0}
            rules={[
              {
                validator: (_, value) => {
                  if (!isNaN(value)) {
                    console.log(value);
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isProcesing}>
              Predaj recept
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  else if (userInfo && userInfo.role === "GUEST")
    return <Unauthorized></Unauthorized>;
  else return <Loading></Loading>;
};

export default RecipeCreate;
