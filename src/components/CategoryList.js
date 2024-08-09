import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { getJWT } from "../utils/utilities";
import axios from "axios";
import { Button } from "antd";

const CategoryList = ({ categories, fetchCategories }) => {
  const { userInfo } = useContext(UserContext);

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
  return (
    <div className="category-list">
      {categories.map((category) => (
        <div className="category-row" key={category.id}>
          <p>{"ID: " + category.id + " name: " + category.name}</p>
          {userInfo &&
            (userInfo.role === "MODERATOR" || userInfo.role === "ADMIN") && (
              <Button
                type="primary"
                onClick={() => {
                  handleDelete(category.id);
                }}
              >
                Obriši
              </Button>
            )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
