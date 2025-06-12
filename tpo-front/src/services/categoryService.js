import api from "./api";

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await api.get(`/category`);
      return response.data.categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

export default categoryService;
