import { Link } from "react-router-dom/cjs/react-router-dom";
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import { getJWT, isoDateToLocale } from "../utils/utilities";
import axios from "axios";

const CommentList = ({ comments, fetchComments }) => {
  const { userInfo } = useContext(UserContext);

  function handleDelete(id) {
    axios
      .delete("/api/recipes/comment/" + id, {
        headers: { Authorization: "Bearer " + getJWT() },
      })
      .then(() => {
        fetchComments();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <div className="comment-header">
            <Link to={`/users/${comment.userId}`}>
              <h4>{comment.username}</h4>
            </Link>
            <h5>{isoDateToLocale(comment.time)}</h5>
          </div>
          <div className="row">
            <p>{comment.comment}</p>
            {userInfo &&
              (userInfo.role === "MODERATOR" || userInfo.role === "ADMIN") && (
                <button
                  onClick={() => {
                    handleDelete(comment.id);
                  }}
                >
                  Obriši
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
