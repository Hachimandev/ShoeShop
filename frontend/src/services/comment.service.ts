import api from "@/lib/api";

export interface CommentRequest {
  productId: string;
  username: string;
  content: string;
  rating: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  rating: number;
  createdAt: string;
  customer: {
    fullName: string;
  };
}

export const commentService = {
  getCommentsByProductId: async (productId: string): Promise<CommentResponse[]> => {
    const response = await api.get(`/comments/by-product/${productId}`);
    return response.data;
  },

  addComment: async (data: CommentRequest): Promise<CommentResponse> => {
    const response = await api.post("/comments", data);
    return response.data;
  },
};
