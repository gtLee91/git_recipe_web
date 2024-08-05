import useFetch from "../hooks/useFetch";
import Modal from "./Add_IngreModal";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Recipe_Modify() {
  const [owner, setOnwer] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState([]);
  const [picAddress, setPicAddress] = useState("");

  const recipe_id = useParams().Recipe;

  const recipe_ingred = useFetch(
    `https://localhost:7230/api/Ingredient/${recipe_id}/ingredient`
  );

  const recipe_info = useFetch(
    `https://localhost:7230/api/Recipe/${recipe_id}`
  );
  const recipe_name = recipe_info.name;
  const recipe_data = useFetch(
    `https://localhost:7230/api/Recipe/search/${recipe_name}`
  );

  const owner_name = useFetch(`https://localhost:7230/api/User/${owner}`);
  const categorys = useFetch("https://localhost:7230/api/Category");
  const storedId = sessionStorage.getItem("userId");

  const history = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshIngredients, setRefreshIngredients] = useState(false);

  useEffect(() => {
    if (recipe_data && recipe_data.length > 0) {
      const recipe = recipe_data[0];
      setOnwer(recipe.userId);
      setName(recipe.name);
      setCategory(recipe.categoryId);
      setInstructions(recipe.instruction.split(",")); // assuming instructions are comma-separated
      setPicAddress(recipe.pic_address);
    }
  }, [recipe_data]);

  useEffect(() => {
    fetch("https://localhost:7230/api/Ingredient")
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data);
      })
      .catch((error) => console.error("error:", error));
  }, [refreshIngredients]);

  useEffect(() => {
    if (recipe_ingred) {
      setSelectedIngredients(recipe_ingred);
    }
  }, [recipe_ingred]);

  const handleAddClick = () => {
    const selectedOption =
      ingreRef.current.options[ingreRef.current.selectedIndex];
    const newIngredient = {
      id: parseInt(selectedOption.getAttribute("data-id"), 10),
      name: selectedOption.value,
    };
    const updatedIngredients = [...selectedIngredients, newIngredient];
    setSelectedIngredients(updatedIngredients);
  };

  const Add_Line = () => {
    setInstructions([...instructions, ""]);
  };

  const Del_Line = () => {
    if (instructions.length > 0) {
      setInstructions(instructions.slice(0, -1));
    }
  };

  const handleInputChange = (index, event) => {
    const newInstructions = [...instructions];
    newInstructions[index] = event.target.value;
    setInstructions(newInstructions);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const Del_ingreRow = (id) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const handleAddIngredient = (newIngredient) => {
    setRefreshIngredients((prev) => !prev);
  };

  function onSubmit(e) {
    e.preventDefault();

    if (!isLoading) {
      setIsLoading(true);

      const ingreIds = selectedIngredients.map((ingredient) => ingredient.id);
      const userId = storedId;
      const categoryId = category;
      //https://localhost:7230/api/Recipe/2?ingreId=2&ingreId=3&ingreId=4&userId=3&categoryId=2
      let url = `https://localhost:7230/api/Recipe/${recipe_id}?`;
      ingreIds.forEach((id) => {
        url += `&ingreId=${id}`;
      });

      url = url += `&userId=${userId}&categoryId=${categoryId}`;

      const formData = new FormData();

      formData.append('id', recipe_id);
      formData.append('name', name);
      formData.append('instruction', combinedInstValues);
      formData.append('file', picRef.current.files[0]);

      fetch(url, {
        method: "PUT",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          alert("modify success.");
          history(`/RecipeList/Recipe/${recipe_id}/${owner_name.userId}`);
          setIsLoading(false);
        } else if (res.status === 422) {
          alert("Already Exist same Recipe.");
          history("/RecipeAdd");
          setIsLoading(false);
        }else {
          alert("Error: " + res.status);
          setIsLoading(false);
      }});
    }
  }

  const ingreRef = useRef(null);
  const picRef = useRef(null);


  const combinedInstValues = instructions.join(",");

  return (
    <form onSubmit={onSubmit}>
      <h1>Recipe Modify Form</h1>
      <div className="input_area">
        <h3>Recipe Name</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="input_area">
        <h3>Category</h3>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categorys.map((ct) => (
            <option key={ct.id} value={ct.id}>
              {ct.name}
            </option>
          ))}
        </select>
      </div>
      <div className="input_area">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Ingredient Select</h3>
          <button onClick={openModal} type="button">
            add ingre
          </button>
        </div>
        <select ref={ingreRef}>
          {ingredients.map((ingre) => (
            <option key={ingre.id} value={ingre.name} data-id={ingre.id}>
              {ingre.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddClick}
          type="button"
          style={{ marginLeft: "20px" }}
        >
          Add
        </button>
      </div>
      <div>
        <table>
          <tbody>
            {selectedIngredients.map((ingredient) => (
              <tr key={ingredient.id}>
                <td>{ingredient.name}</td>
                <button
                  onClick={() => Del_ingreRow(ingredient.id)}
                  type="button"
                  style={{ marginLeft: "20px" }}
                >
                  Del
                </button>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="input_area">
        <h3>Instruction</h3>
        <table style={{ border: 0, borderCollapse: "collapse" }}>
          <tbody>
            {instructions.map((instruction, index) => (
              <tr key={index}>
                <td style={{ border: 0 }}>{index + 1}</td>
                <td style={{ border: 0 }}>
                  <input
                    type="text"
                    value={instruction}
                    onChange={(event) => handleInputChange(index, event)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={Add_Line} type="button">
          Add Line
        </button>
        <button onClick={Del_Line} type="button" style={{ marginLeft: "20px" }}>
          Del Line
        </button>
        <div style={{ display: "none" }}>
          <strong>Combined Inst Values:</strong> {combinedInstValues}
        </div>
      </div>
      <div className="input_area">
        <h3>Picture</h3>
        <input type="file" ref={picRef} />
      </div>
      <button style={{ opacity: isLoading ? 0.3 : 1 }}>
        {isLoading ? "Saveing..." : "Save"}
      </button>
      <Link
        to={`/RecipeList/Recipe/${recipe_id}/${owner_name.userId}`}
        style={{ marginLeft: "10px", textDecoration: "none" }}
      >
        <button className="backbutton" type="button">
          Back to Detail Recipe Page
        </button>
      </Link>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddIngredient}
      />
    </form>
  );
}
