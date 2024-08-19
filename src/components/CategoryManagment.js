import { useEffect, useState } from "react";
import { getJWT } from "../utils/utilities";
import axios from "axios";
import { Button } from "antd";
import { Space, Table, Tag, Input } from "antd";
import Loading from "./Loading";
const { Column } = Table;

const CategoryManagment = () => {
  const [categories, setCategories] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios
      .get("/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDelete(id) {
    axios
      .delete("api/categories/" + id, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function addCategory() {
    axios
      .post(
        "/api/categories/" + newCategory,
        {},
        {
          headers: { Authorization: "Bearer " + getJWT() },
        }
      )
      .then(() => {
        fetchCategories();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (categories) {
    return (
      <>
        <div className="tight-row">
          <label>Dodaj novu kategoriju:</label>
          <Input
            style={{ width: "30%", marginLeft: "10px", marginRight: "5px" }}
            type="text"
            required
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          ></Input>
          <Button onClick={addCategory} type="primary">
            Dodaj
          </Button>
        </div>
        <Table
          style={{ maxWidth: "800px", margin: "auto", marginTop: "10px" }}
          dataSource={categories}
          rowKey={"id"}
        >
          <Column title="ID kategorije" dataIndex="id" key="id" />
          <Column title="Naziv kategorije" dataIndex="name" key="name" />
          <Column
            title="Akcije"
            key={"action"}
            render={(_, record) => (
              <Button
                type="primary"
                onClick={() => {
                  handleDelete(record.id);
                }}
              >
                Obriši
              </Button>
            )}
          />
        </Table>
      </>
    );
  } else return <Loading></Loading>;
};

export default CategoryManagment;
