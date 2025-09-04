import { useEffect, useState } from "react";

type Review = {
  id: number;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
};

export default function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // fetch review theo productId
  useEffect(() => {
    fetch(`http://localhost:3001/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReview = {
      productId,
      userName: "Demo User", // sau này thay bằng user login
      rating,
      comment,
    };

    const res = await fetch("http://localhost:3001/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });

    const data = await res.json();
    setReviews([...reviews, data]); // cập nhật list
    setRating(0);
    setComment("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Đánh giá sản phẩm</h3>

      {/* Hiển thị danh sách review */}
      <div className="space-y-2">
        {reviews.map((r) => (
          <div key={r.id} className="border p-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{r.userName}</span>
              <span>{"⭐".repeat(r.rating)}</span>
            </div>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Form thêm review */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value={0}>Chọn số sao</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập review..."
          className="w-full border rounded px-2 py-1"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Gửi review
        </button>
      </form>
    </div>
  );
}