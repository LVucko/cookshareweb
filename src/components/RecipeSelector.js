import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";

function RecipeSelector({ passSorting, passNumber, passCategory }) {
  const [number, setNumber] = useState("15");
  const [sorting, setSorting] = useState("latest");
  const [category, setCategory] = useState("0");
  const [categories, setCategories] = useState([{ value: "0", label: "Sve" }]);
  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => {
        const options = [
          { value: "0", label: "Sve" },
          ...response.data.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ];
        setCategories(options);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    passNumber(number);
  }, [number]);
  useEffect(() => {
    passSorting(sorting);
  }, [sorting]);
  useEffect(() => {
    passCategory(category);
  }, [category]);
  const handleNumberChange = (value) => {
    setNumber(value);
  };
  const handleSortingChange = (value) => {
    setSorting(value);
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  return (
    <div>
      <div className="recipe-selector">
        <div>
          <label>Sortiraj po: </label>
          <Select
            defaultValue="latest"
            style={{
              width: 150,
            }}
            onChange={handleSortingChange}
            options={[
              {
                value: "latest",
                label: "najnoviji",
              },
              {
                value: "best",
                label: "najbolje ocjenjeni",
              },
              {
                value: "least",
                label: "najmanje ocjenjeni",
              },
            ]}
          ></Select>
        </div>
        <div>
          <label>Broj prikazanih recepata: </label>
          <Select
            defaultValue="15"
            style={{
              width: 60,
            }}
            onChange={handleNumberChange}
            options={[
              {
                value: "15",
                label: "15",
              },
              {
                value: "30",
                label: "30",
              },
              {
                value: "60",
                label: "60",
              },
            ]}
          ></Select>
        </div>
        <div>
          <label>Kategorija: </label>
          <Select
            defaultValue={"0"}
            onChange={handleCategoryChange}
            style={{
              width: 150,
            }}
            options={categories}
          ></Select>
        </div>
      </div>
    </div>
  );
}

export default RecipeSelector;
