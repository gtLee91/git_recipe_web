import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Header from "./Header";
import { useEffect, useState, useRef } from "react";
import Review from "./Review";
import DelModal from "./Del_RecipeModal";
import '../Css/Dt_Recipe.css';


export default function Dt_Recipe() {

    const recipe_id = useParams().Recipe;
    const user_id = useParams().UId;
    const [match_writer, Setmatch_writer] = useState(false);
    const recipe = useFetch(`https://localhost:7230/api/Recipe/${recipe_id}`);
    const storedId = sessionStorage.getItem("userId");
    const ingredient = useFetch(`https://localhost:7230/api/Ingredient/${recipe_id}/ingredient`);
    const [ingreList, SetIngreList] = useState('');
    const [instru, SetInstru] = useState([]);
    const FilterRef = useRef(null);
    const getuser = useFetch(`https://localhost:7230/api/User/${storedId}`);
    const [url, setUrl] = useState(`https://localhost:7230/api/Review/${recipe_id}/review`);
    const [reviewList, setReviewList] = useState([]);
    const ContentRef = useRef(null);
    const RatingRef = useRef(null);
    const [status, setStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(true);
    let imageUrl = '';

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10;

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviewList.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(reviewList.length / reviewsPerPage);

    useEffect(() => {
        if (ingredient) {
            const names = ingredient.map((ingre) => ingre.name).join(", ");
            SetIngreList(names);
        }
    }, [ingredient]);

    useEffect(() => {
        if (recipe && recipe.instruction) {
            const instructionsArray = recipe.instruction
                .split(",")
                .map((item, index) => `${index + 1}. ${item.trim()}`);
            SetInstru(instructionsArray);
        }
    }, [recipe]);

    useEffect(() => {
        if (user_id === getuser.userId) {
            Setmatch_writer(true);
        } else {
            Setmatch_writer(false);
        }
    }, [user_id, getuser.userId]);

    useEffect(() => {
        fetch(url)
            .then(res => {
                return res.json()
            }).then(data =>
                setReviewList(data)
            ).catch(() =>
                setReviewList([])
            );
    }, [url]);

    function review_change(event) {
        if (event.target.value === "None") {
            setUrl(`https://localhost:7230/api/Review/${recipe_id}/review`);
        }
        else {
            setUrl(`https://localhost:7230/api/Review/${recipe_id}/${storedId}/review`);
        }
    }

    function onSubmit(e) {
        e.preventDefault();
        if (FilterRef.current.value === 'None') {
            FilterRef.current.value = getuser.userId;
        }

        review_change({ target: { value: getuser.userId } });

        fetch("https://localhost:7230/api/Review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: new Date().toISOString(),
                content: ContentRef.current.value,
                rating: RatingRef.current.value,
                userId: storedId,
                recipeId: recipe_id
            }),
        }).then((res) => {
            if (res.ok) {
                setStatus("Add review success.");
                ContentRef.current.value = '';
                RatingRef.current.value = '1';

                if (FilterRef.current) {
                    FilterRef.current.value = 'None';
                }

                review_change({ target: { value: 'None' } });
            } else {
                setStatus("Failed to add review.");
            }
        }).catch(() => {
            setStatus("Failed to add review.");
        });
    }

    function handleDelete(reviewId) {
        setReviewList(prevReviews => prevReviews.filter(review => review.id !== reviewId));
    }

    function nextPage() {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const openDelModal = () => {
        setShowModal(true);
    };

    const handleError = () => {
        setImageLoaded(false);
    };

    // const recipe_pic_add = recipe.pic_address;
    // if (recipe_pic_add) {
    //     const image_name = recipe_pic_add.split('\\').pop();
    //     imageUrl = `https://localhost:7230/api/Recipe/images/${image_name}`;
    // }

    const convertToBase64 = (arrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    imageUrl = recipe.imageData ? `data:image/jpeg;base64,${recipe.imageData}` : null;


    return (
        <>
            <Header />
            <div className="container_Dt">
                <section id="content_Dt">
                    <DelModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        current_recipe_id={recipe_id}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 style={{ color: "Red" }}>{recipe.name}</h2>
                        {match_writer && (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Link to={`/RecipeList/Recipe/Modify/${recipe_id}`}>
                                    <button className="recipe_btn_modify">Modify</button>
                                </Link>
                                <button className="recipe_btn_del" onClick={openDelModal}>Delete</button>
                            </div>
                        )}
                    </div>
                    <div className="recipe_div_img">
                        {imageLoaded && imageUrl ? (<img src={imageUrl} alt="Recipe" onError={handleError} />) : (<p>Image not available</p>)}
                    </div>
                    <div className="recipe_div">
                        <h3 style={{ color: "green" }}>Ingredient</h3>
                        {ingreList}
                    </div>
                    <div className="recipe_div">
                        <h3 style={{ color: "skyblue" }}>Instruction</h3>
                        {instru.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
                    </div>
                    <div className="recipe_div" style={{ position: 'relative' }}>
                        <h3 style={{ color: "purple" }}>Review</h3>

                        <form onSubmit={onSubmit}>
                            <div className="input_add_review">
                                <label>Review:</label>
                                <input type="text" placeholder="Content" ref={ContentRef} />
                                <label>Rate:</label>
                                <select style={{ marginLeft: '5px' }} ref={RatingRef}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button className="button_Add_review" style={{ marginLeft: '5px' }}>Add</button>
                            </div>
                        </form>

                        <div className="review_filter_div">
                            <select ref={FilterRef} onChange={review_change}>
                                <option value="None">None</option>
                                <option value={getuser.userId}>{getuser.userId}</option>
                            </select>
                        </div>
                        <table className="table_review">
                            <tbody>
                                <tr>
                                    <td style={{ border: 'none', fontWeight: 'bold', color: 'grey' }}>Date</td>
                                    <td style={{ border: 'none', fontWeight: 'bold', color: 'grey' }}>Content</td>
                                    <td style={{ border: 'none', fontWeight: 'bold', color: 'grey' }}>Reviewer</td>
                                    <td style={{ border: 'none', fontWeight: 'bold', color: 'grey' }}>Rating</td>
                                </tr>
                                {currentReviews.map(review => (
                                    <Review review={review} key={review.id} onDelete={handleDelete} />
                                ))}
                            </tbody>
                        </table>
                        <div className="next_back_div">
                            <button onClick={prevPage} style={{ opacity: (currentPage === 1) ? 0.3 : 1 }} disabled={currentPage === 1}>Back</button>
                            <label>{currentPage}</label>
                            <button onClick={nextPage} style={{ opacity: (currentPage === totalPages) || (totalPages === 0) ? 0.3 : 1 }} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}