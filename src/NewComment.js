
import {useState, useEffect} from "react";

function NewComment({passComment, isDisabled, isPending}) {
    const [newComment, setNewComment] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    useEffect(() => {
        (isDisabled) ? setPlaceholder("Prijavite se kako bi ste mogli komentirati"):setPlaceholder("Unesite svoj komentar");
    },[isDisabled]);
    function handleSubmit(e){
        e.preventDefault();
        passComment(newComment);
        setNewComment('');
    };
    return (
        <form className="comment-new" onSubmit = {handleSubmit}>
                    <textarea 
                    placeholder={placeholder}
                    disabled = {isDisabled}
                    required 
                    value = {newComment} 
                    onChange = {(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="row">
                        <div></div>
                        {!isPending && !isDisabled && <button>Dodaj komentar</button>}
                        {(isPending || isDisabled) && <button id="disabledButton" disabled={true}>Dodaj komentar</button>}
                    </div>
        </form>
    );
}

export default NewComment;