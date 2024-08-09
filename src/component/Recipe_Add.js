import useFetch from "../hooks/useFetch";
import Modal from "./Add_IngreModal";
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../Css/Recipe_Add.css';

export default function Recipe_Add() {
  const categorys = useFetch("https://localhost:7230/api/Category");
  const storedId = sessionStorage.getItem("userId");

  const history = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshIngredients, setRefreshIngredients] = useState(false);

  const [rows, setRows] = useState([""]);
  const [inputValues, setInputValues] = useState([""]);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  useEffect(() => {
    fetch("https://localhost:7230/api/Ingredient")
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data);
      })
      .catch((error) => console.error("error:", error));
  }, [refreshIngredients]);

  const handleAddClick = () => {
    const selectedOption = ingreRef.current.options[ingreRef.current.selectedIndex];
    const newIngredient = {
      id: parseInt(selectedOption.getAttribute("data-id"), 10),
      name: selectedOption.value,
    };
  
    const isDuplicate = selectedIngredients.some(ingredient => ingredient.id === newIngredient.id);
    
    if (isDuplicate) {
      alert("Already selected ingredient");
      return;
    }
  
    const updatedIngredients = [...selectedIngredients, newIngredient];
    setSelectedIngredients(updatedIngredients);
  };

  const Add_Line = () => {
    setRows([...rows, ""]);
    setInputValues([...inputValues, ""]);
  };

  const Del_Line = () => {
    if (rows.length > 0) {
      setRows(rows.slice(0, -1));
      setInputValues(inputValues.slice(0, -1));
    }
  };

  const Del_ingreRow = (id) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== id)
    );
  };

  const handleInputChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const handleAddIngredient = (newIngredient) => {
    setRefreshIngredients((prev) => !prev);
  };

  function onSubmit(e) {
    e.preventDefault();

    if (!picRef.current.files.length > 0)
    {
        alert("include picture!!");
        return
    }

    if (!isLoading) {
      setIsLoading(true);

      const ingreIds = selectedIngredients.map((ingredient) => ingredient.id);
      const userId = storedId;
      const categoryId = parseInt(
        categoryRef.current.options[
          categoryRef.current.selectedIndex
        ].getAttribute("dataid"),
        10
      );

      const formData = new FormData();

      formData.append('name', nameRef.current.value);
      formData.append('instruction', combinedInstValues);
      formData.append('file', picRef.current.files[0]);

      let url = `https://localhost:7230/api/Recipe?userId=${userId}&categoryId=${categoryId}`;
      ingreIds.forEach((id) => {
        url += `&ingreId=${id}`;
      });

      

      fetch(url, {
        method: "POST",
        body: formData,
      }).then((res) => {
        if (res.ok) {
          alert("Registration success.");
          history("/RecipeList");
          setIsLoading(false);
        } else if (res.status === 422) {
          alert("Already Exist same Recipe.");
          history("/RecipeAdd");
          setIsLoading(false);
        }else {
          alert("Error: " + res.status);
          setIsLoading(false);
      }
      });
    }
  }

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const ingreRef = useRef(null);
  const picRef = useRef(null);

  const combinedInstValues = inputValues.join(",");

  return (
    <div className="add_container">
      <section id="add_content">

        <form onSubmit={onSubmit}>
          <h1>Recipe Registation</h1>
          <div>
            <h3>Recipe Name</h3>
            <input type="text" ref={nameRef} />
          </div>

          <div className="input_area">
            <h3>Category</h3>
            <select ref={categoryRef}>
              {categorys.map((ct) => (
                <option key={ct.id} value={ct.name} dataid={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input_area">
            <h3>Ingredient Select</h3>
            <div style={{ display: "flex", alignItems: "center", marginLeft:"160px", height:"60px" }}>
            <select ref={ingreRef} onChange={handleAddClick} defaultValue="" style={{ width: "250px"}}>
              <option value="" disabled>------</option>
              {ingredients.map((ingre) => (
                <option key={ingre.id} value={ingre.name} data-id={ingre.id}>
                  {ingre.name}
                </option>
              ))}
            </select>
            <Link>
              <button onClick={openModal} type="button" style={{width:"180px"}}>
                  Create New ingre
              </button>
            </Link>
            
            </div>            
          </div>

          <div className="table_container">
            <table className="ingre_table">
              <tbody>
                {selectedIngredients.map((ingredient) => (
                  <tr key={ingredient.id}>
                    <td style={{ border: "1px solid black", width:"80%"}}>{ingredient.name}</td>
                    <td style={{ border: "1px solid black" }}>
                      <button className="del_btn"
                        onClick={() => Del_ingreRow(ingredient.id)}
                        type="button"
                        style={{ marginBottom:"5px", marginLeft: "10px", marginRight: "10px",width:"70px"}}
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="input_area">
            <h3>Instruction</h3>
            <table style={{ border: 0, borderCollapse: "collapse" }}>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td style={{ border: 0, fontSize: "20px"}}>{index + 1}</td>
                    <td style={{ border: 0 }}>
                      <input
                        type="text"
                        value={inputValues[index]}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="add_inst_btn">
              <button onClick={Add_Line} type="button">
                Add Line
              </button>
              <button onClick={Del_Line} type="button" style={{ marginLeft: "20px" }}>
                Del Line
              </button>
            </div>
            
          </div>

          <div>
            <h3>Picture</h3>
            <div className="add_last_btn_line">
              <input type="file" ref={picRef} name="uploadfile" id="img" style={{display:"none"}} onChange={handleFileChange}/>
              <label htmlFor="img" className="filebutton">Select file</label>
              {fileName && <p style={{marginLeft: "30px", fontSize : "16px" , fontWeight: "bold" }}>{fileName}</p>}
            </div>
          </div>

          <div className="add_last_btn_line">
            <button style={{ opacity: isLoading ? 0.3 : 1, marginTop:"38px"}}>
              {isLoading ? "Saveing..." : "Save"}
            </button>
            <Link
              to="/RecipeList"
              style={{ marginLeft: "10px", textDecoration: "none" }}
            >
              <button className="backbutton" type="button">
                Go to List
              </button>
            </Link>
          </div>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            onAdd={handleAddIngredient}
          />
        </form>
      </section>
    </div>
  );
}
