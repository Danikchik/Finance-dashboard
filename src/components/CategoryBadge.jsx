import Icon from "./Icon";
import { CATEGORY_META } from "../utils";
import "./CategoryBadge.scss";

function CategoryBadge({ category, size = 40 }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;

  return (
    <span
      className="category-badge"
      style={{ "--c": meta.color, width: size, height: size }}
    >
      <Icon name={meta.icon} size={Math.round(size * 0.5)} />
    </span>
  );
}

export default CategoryBadge;
