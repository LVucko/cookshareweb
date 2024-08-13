import { useState, useEffect } from "react";
import axios from "axios";
import { getJWT } from "../utils/utilities";
import { Button } from "antd";
import { Input } from "antd";
const { TextArea } = Input;

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
    <>
      <TextArea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        placeholder={placeholder}
        disabled={isDisabled}
        maxLength={256}
      />
      <div className="row">
        <div></div>
        {!isPending && !isDisabled && (
          <Button type="primary" onClick={handleComment}>
            Dodaj komentar
          </Button>
        )}
        {(isPending || isDisabled) && (
          <Button type="primary" disabled={true}>
            Dodaj komentar
          </Button>
        )}
      </div>
    </>
  );
}

export default NewComment;
