function StarRating({ title, rating }) {
  return (
    <div className="tight-row">
      <div>{title}</div>
      <div className="star-container">
        <div
          className="stars"
          style={{ clipPath: `inset(0% ${100 - 20 * rating}% 0% 0%)` }}
        >
          ★★★★★
        </div>
        <div
          className="empty-stars"
          style={{ clipPath: `inset(0% 0% 0% ${20 * rating}%)` }}
        >
          ★★★★★
        </div>
      </div>
    </div>
  );
}

export default StarRating;
