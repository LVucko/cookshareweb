import UserContext from "../contexts/UserContext";
import { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { getJWT } from "../utils/utilities";
import Loading from "../components/Loading";
import Unauthorized from "./Unauthorized";
import { Button, Input, Form, Checkbox } from "antd";

import ImageUpload from "../components/ImageUpload";

const RecipeEdit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();
  const [isProcesing, setIsProcessing] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get("/api/recipes/" + id)
      .then((response) => {
        setRecipe(response.data);
        console.log(response.data);
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
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (allCategories && recipe) {
      var checkedCategories = [];
      allCategories.forEach((category) => {
        if (recipe.categories.includes(category.label)) {
          checkedCategories.push(category.value);
        }
      });
      setRecipe({
        ...recipe,
        categories: checkedCategories,
      });
      setIsLoading(false);
    }
  }, [allCategories]);

  const handleSubmit = (values) => {
    let recipe;
    if (values.pictureIds === null) {
      recipe = { ...values, pictureIds: null, id: id };
    } else {
      recipe = { ...values, pictureIds: [values.pictureIds], id: id };
    }

    setIsProcessing(true);
    axios
      .put("/api/recipes", recipe, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        history.push("/recipes/" + id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  if (
    userInfo &&
    !isLoading &&
    (userInfo.userId === recipe.userId ||
      userInfo.role === "MODERATOR" ||
      userInfo.role === "ADMIN")
  )
    return (
      <div className="default-form">
        <h2>Izmjeni recept</h2>
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          name="form"
          onFinish={handleSubmit}
          initialValues={recipe}
        >
          <br></br>
          <Form.Item
            name="title"
            label="Naziv recepta:"
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
            <ImageUpload
              isProcessing={(e) => setIsProcessing(e)}
              currentImagePath={"/../../" + recipe.pathToPictures[0]}
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

export default RecipeEdit;
