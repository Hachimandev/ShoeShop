"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle, ThumbsUp, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { commentService, CommentResponse } from "@/services/comment.service";

export default function ProductComments({ productId }: { productId: string }) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByProductId(productId);
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    const username = localStorage.getItem("username");
    if (!username) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm.");
      return;
    }

    setSubmitting(true);
    try {
      await commentService.addComment({
        productId,
        username,
        content: newComment,
        rating,
      });
      setNewComment("");
      setRating(5);
      fetchComments(); // Tải lại danh sách đánh giá
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="mt-16 pt-12 border-t border-slate-200">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-8 h-8 text-slate-800" />
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Đánh giá sản phẩm</h3>
        <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-bold ml-2">
          {comments.length}
        </span>
      </div>

      {/* Comment Form */}
      <div className="bg-slate-50 p-6 md:p-8 rounded-3xl mb-12 shadow-inner border border-slate-100">
        <h4 className="font-semibold text-lg text-slate-800 mb-4">Viết đánh giá của bạn</h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-2 bg-white w-fit px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-sm font-medium text-slate-600">Chất lượng:</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <textarea
              className="w-full min-h-[140px] p-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 resize-none transition-all duration-300 outline-none text-slate-700 text-base shadow-sm"
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="submit"
              className="absolute bottom-5 right-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 py-2.5 h-auto flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 font-medium"
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-16 px-4 text-slate-500 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
            <MessageCircle className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-600">Chưa có đánh giá nào.</p>
            <p className="text-slate-500 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const userName = comment.customer?.fullName || "Khách hàng";
            return (
              <div key={comment.id} className="flex gap-5 p-6 md:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <Avatar className="w-14 h-14 border-2 border-white shadow-sm ring-2 ring-slate-100">
                  <AvatarFallback className="bg-slate-900 text-white font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                    <div>
                      <h5 className="font-bold text-lg text-slate-900">{userName}</h5>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < comment.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-sm font-medium text-slate-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-base">{comment.content}</p>
                  
                  <div className="mt-5 flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Hữu ích (0)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
