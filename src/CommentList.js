import { Link } from "react-router-dom/cjs/react-router-dom";

const CommentList = ({comments, title, handleDelete}) => {

    return (  
        <div className = "comment-list">
            <h1>{title}</h1>
            {comments.map((comment) =>(
                <div className= "comment" key = {comment.id}>
                    <Link to = {`/users/${comment.userId}`}>
                    <h4>{comment.username}</h4>
                    </Link>
                    <h5>{comment.time}</h5>
                    <p>{comment.comment}</p>
                </div>
            ))}
        </div>
    );
}
 
export default CommentList;