import { Promotion } from "@/types/promotion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const promotionService = {
  getValidPromotions: async (): Promise<Promotion[]> => {
    try {
      const response = await fetch(`${API_URL}/promotions/valid`);
      if (!response.ok) {
        throw new Error("Failed to fetch valid promotions");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching valid promotions:", error);
      throw error;
    }
  },

  getPromotionById: async (promotionId: string): Promise<Promotion> => {
    try {
      const response = await fetch(`${API_URL}/promotions/${promotionId}`);
      if (!response.ok) {
        throw new Error("Promotion not found");
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching promotion ${promotionId}:`, error);
      throw error;
    }
  },
};
