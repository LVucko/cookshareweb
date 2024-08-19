import { Tooltip } from "antd";
function StarRating({ title, rating }) {
  return (
    <Tooltip
      placement="right"
      title={(Math.round(rating * 100) / 100).toFixed(2) + "/5"}
    >
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
    </Tooltip>
  );
}

export default StarRating;
