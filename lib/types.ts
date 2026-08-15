export interface Category {
  id: string;
  name: string;
  code: string;
  children?: Category[];
}

export interface CategoryDataset {
  schemaVersion: number;
  updatedAt: string;
  categories: Category[];
}

export interface FlatCategory {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  parentName?: string;
  childIds: string[];
  depth: number;
}

export type OpenBehavior = "reuse-current-tab" | "new-tab";

export type OpenCategoryFn = (id: string, behavior: OpenBehavior) => void;

export type ThemePreference = "light" | "dark";

export interface ExtensionPreferences {
  schemaVersion: number;
  favorites: string[];
  hiddenCategories: string[];
  recentCategories: string[];
  experimentalHeaderMenuEnabled: boolean;
  experimentalHeaderMenuNoticeDismissed: boolean;
  openBehavior: OpenBehavior;
  theme: ThemePreference;
  emptyCategories: string[];
}

export interface SearchHit {
  category: FlatCategory;
  reason: "name" | "code" | "parent";
}
