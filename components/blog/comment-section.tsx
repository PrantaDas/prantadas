"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { MessageSquare, Send, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitComment, type CommentData } from "@/app/actions/comments";

const schema = z.object({
  name: z.string().min(2, "At least 2 characters").max(50),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "At least 10 characters").max(1000),
  rating: z.number().int().min(1, "Select a rating").max(5),
});
type FormValues = z.infer<typeof schema>;

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus-visible:outline-none"
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-white/20",
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

function CommentCard({ comment }: { comment: CommentData }) {
  return (
    <div className="p-4 rounded-xl border border-white/6 bg-white/2">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-white/80">{comment.name}</div>
            <div className="text-xs text-white/30 font-mono">
              {format(new Date(comment.createdAt), "MMM d, yyyy")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                "w-3.5 h-3.5",
                s <= comment.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-white/15",
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-white/55 leading-relaxed">{comment.message}</p>
    </div>
  );
}

interface CommentSectionProps {
  slug: string;
  initialComments: CommentData[];
}

export function CommentSection({ slug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = await submitComment(slug, data);
      if (result.success) {
        toast.success("Comment posted!");
        reset();
        // Optimistically add to top
        setComments((prev) => [
          {
            id: Date.now().toString(),
            name: data.name,
            message: data.message,
            rating: data.rating,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else if (result.error) {
        toast.error(result.error);
      } else if (result.fieldErrors) {
        toast.error("Please fix the errors and try again.");
      }
    });
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors";

  return (
    <section aria-label="Comments" className="mt-16 pt-10 border-t border-white/6">
      <h2 className="font-display text-xl font-semibold text-white/80 mb-8 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary/60" aria-hidden="true" />
        {comments.length > 0
          ? `${comments.length} Comment${comments.length > 1 ? "s" : ""}`
          : "Leave a Comment"}
      </h2>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-5 rounded-2xl border border-white/8 bg-white/2 mb-8 space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("name")}
              placeholder="Your name"
              className={inputClass}
              aria-label="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email (not shown publicly)"
              className={inputClass}
              aria-label="Email address"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="Share your thoughts..."
            rows={4}
            className={cn(inputClass, "resize-none")}
            aria-label="Your comment"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-white/35 font-mono mb-1.5">Rating</p>
            <StarRating value={rating} onChange={(v) => setValue("rating", v)} />
            {errors.rating && (
              <p className="mt-1 text-xs text-red-400">{errors.rating.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="w-4 h-4" aria-hidden="true" />
            )}
            {isPending ? "Posting…" : "Post Comment"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/30 font-mono text-center py-8">
          No comments yet — be the first!
        </p>
      )}
    </section>
  );
}
