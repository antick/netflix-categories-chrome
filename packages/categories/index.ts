import json from "./netflix-categories.json";

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

export const dataset = json as CategoryDataset;
