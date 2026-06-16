import api from "@/lib/api";

export interface Category {
  categoryId: string;
  categoryName: string;
}

export const categoryService = {
  getAllCategories: async (signal?: AbortSignal): Promise<Category[]> => {
    const response = await api.get("/categories", { signal });
    return response.data;
  },

  createCategory: async (category: Category): Promise<Category> => {
    const response = await api.post("/categories", category);
    return response.data;
  },

  updateCategory: async (id: string, category: Category): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  }
};
