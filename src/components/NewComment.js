import { useState, useEffect } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";
function NewComment({ id, fetchComments, isActive }) {
  const [newComment, setNewComment] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (isActive) {
      setIsDisabled(false);
      setPlaceholder("Unesite svoj komentar");
    } else setPlaceholder("Prijavite se kako bi ste mogli komentirati");
  }, []);

  function handleComment(e) {
    e.preventDefault();
    const comment = { recipeId: id, comment: newComment };
    setIsPending(true);
    axios
      .post("/api/recipes/" + id + "/comments", comment, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        fetchComments();
        setNewComment("");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsPending(false);
      });
  }

  return (
    <form className="comment-new" onSubmit={handleComment}>
      <textarea
        placeholder={placeholder}
        disabled={isDisabled}
        required
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      ></textarea>
      <div className="row">
        <div></div>
        {!isPending && !isDisabled && <button>Dodaj komentar</button>}
        {(isPending || isDisabled) && (
          <button id="disabledButton" disabled={true}>
            Dodaj komentar
          </button>
        )}
      </div>
    </form>
  );
}

export default NewComment;
