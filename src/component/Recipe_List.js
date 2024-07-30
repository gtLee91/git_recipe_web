import { useLocation } from 'react-router-dom'
import useFetch from '../hooks/useFetch';
import Recipe from './Recipe';
import { useRef, useState } from "react";

export default function Recipe_List() {

    const location = useLocation();
    const { Id } = location.state || {};
    const [url, setUrl] = useState(`https://localhost:7225/api/Recipe`);
    const recipeList = useFetch(url);
    const NameRef = useRef(null);
    const FilterRef = useRef(null);
    const categories = useFetch(`https://localhost:7225/api/Category`);

    function search() {
        if (NameRef.current.value.length > 2) {
            if (FilterRef.current.value === "None"){
                setUrl(`https://localhost:7225/api/Recipe/search/${NameRef.current.value}`);
            }
            else{
                setUrl(`https://localhost:7225/api/Recipe/filter_search/${FilterRef.current.value}/${NameRef.current.value}`);
            }
        }
        else {
            alert("Write Name over 3 words");
        }

    }

    function filter(event){
        if (event.target.value === "None"){
            setUrl(`https://localhost:7225/api/Recipe`);
        }
        else{
            setUrl(`https://localhost:7225/api/Recipe/filter/${event.target.value}`);
        }
    }

    return (
        <>
            <h2>{Id}</h2>

            <div className="input_search">
                <input type="text" placeholder="Name" ref={NameRef} />
                <button onClick={search}>search</button>
                <select ref={FilterRef} onChange={filter}>
                    <option value="None">None</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                    <tr>
                        <td style={{ border: 'none' }}>Name</td>
                        <td style={{ border: 'none' }}>Category</td>
                        <td style={{ border: 'none' }}>Writer</td>
                    </tr>
                    {recipeList.map(recipe => (
                        <Recipe recipe={recipe} key={recipe.id} />
                    ))}
                </tbody>
            </table>
        </>
    )
}