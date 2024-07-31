import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { getJWT } from "../utils/utilities";
import axios from "axios";

const CategoryList = ({ categories, fetchCategories }) => {
  const { userInfo } = useContext(UserContext);

  function handleDelete(id) {
    var token = getJWT();
    axios
      .delete("api/categories/" + id, {
        headers: { Authorization: "Bearer " + token },
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
              <button
                onClick={() => {
                  handleDelete(category.id);
                }}
              >
                Obriši
              </button>
            )}
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
