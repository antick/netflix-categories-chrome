import type { Category, FlatCategory, OpenCategoryFn } from "../lib/types";
import { CategoryGroup } from "./CategoryGroup";

interface CategoryListProps {
  tree: Category[];
  flatById: Map<string, FlatCategory>;
  favorites: Set<string>;
  hidden: Set<string>;
  onOpen: OpenCategoryFn;
  onFavorite: (id: string) => void;
  onHide: (id: string) => void;
}

export function CategoryList(props: CategoryListProps) {
  return (
    <div className="flex flex-col gap-0.5 pb-3">
      {props.tree.map((category) => (
        <CategoryGroup key={category.id} category={category} {...props} />
      ))}
    </div>
  );
}
