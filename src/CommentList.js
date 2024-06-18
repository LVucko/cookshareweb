import { Link } from "react-router-dom/cjs/react-router-dom";

const CommentList = ({comments, title, handleDelete}) => {
    const getDate = (isostring) =>{
        var isodate = new Date(isostring);
        return isodate.toLocaleString("Hr-hr");
    }
    return (  
        <div className = "comment-list">
            <h1>{title}</h1>
            {comments.map((comment) =>(
                <div className= "comment" key = {comment.id}>
                    <div className  = "comment-header">
                        <Link to = {`/users/${comment.userId}`}>
                        <h4>{comment.username}</h4>
                        </Link>
                        <h5>{getDate(comment.time)}</h5>
                    </div>
                    <p>{comment.comment}</p>
                </div>
            ))}
        </div>
    );
}
 
export default CommentList;