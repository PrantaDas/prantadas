"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { MessageSquare, Send, Star, Loader2, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitComment, type CommentData } from "@/app/actions/comments";

const VISITOR_KEY = "portfolio_vid";
const commentedKey = (slug: string) => `commented_${slug}`;

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

const schema = z.object({
  name:    z.string().min(2, "At least 2 characters").max(50),
  email:   z.string().email("Enter a valid email"),
  message: z.string().min(10, "At least 10 characters").max(1000),
  rating:  z.number().int().min(1, "Select a rating").max(5),
});
type FormValues = z.infer<typeof schema>;

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star} type="button" role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="focus-visible:outline-none"
        >
          <Star
            className={cn("w-5 h-5 transition-colors",
              star <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "text-white/20"
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}

function Avatar({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" }) {
  const [imgError, setImgError] = useState(false);
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  if (src && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        onError={() => setImgError(true)}
        className={cn(dim, "rounded-full object-cover border border-white/10 flex-shrink-0")}
      />
    );
  }

  return (
    <div className={cn(dim, "rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0")}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function CommentCard({ comment }: { comment: CommentData }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-white/6 bg-white/2 hover:border-white/10 transition-colors">
      <Avatar src={comment.avatar} name={comment.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-white/80 truncate">{comment.name}</span>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("w-3 h-3", s <= comment.rating ? "fill-yellow-400 text-yellow-400" : "text-white/15")} aria-hidden="true" />
              ))}
            </div>
          </div>
          <time className="text-xs text-white/25 font-mono flex-shrink-0">
            {format(new Date(comment.createdAt), "MMM d, yyyy")}
          </time>
        </div>
        <p className="text-sm text-white/55 leading-relaxed">{comment.message}</p>
      </div>
    </div>
  );
}

interface CommentSectionProps {
  slug: string;
  initialComments: CommentData[];
}

export function CommentSection({ slug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [formOpen, setFormOpen] = useState(false);
  const [alreadyCommented, setAlreadyCommented] = useState(false);
  const [isPending, startTransition] = useTransition();
  const visitorIdRef = useRef<string>("");

  // Read visitor ID and check if already commented — runs only on client
  useEffect(() => {
    visitorIdRef.current = getVisitorId();
    if (localStorage.getItem(commentedKey(slug))) {
      setAlreadyCommented(true);
    }
  }, [slug]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-white/4 border border-white/8 text-white/80 text-sm placeholder:text-white/25 focus:outline-none focus:border-primary/40 focus:bg-white/6 transition-colors";

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      const result = await submitComment(slug, data, visitorIdRef.current || undefined);

      if (result.success) {
        // Mark as commented in localStorage so the form won't show on next visit
        localStorage.setItem(commentedKey(slug), "1");
        setAlreadyCommented(true);
        toast.success("Comment posted!", { description: "Thanks for sharing your thoughts." });
        reset();
        setFormOpen(false);
        setComments((prev) => [
          {
            id: Date.now().toString(),
            name: data.name,
            message: data.message,
            rating: data.rating,
            avatar: result.avatar,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else if (result.duplicate) {
        // Server confirmed duplicate — sync the localStorage flag
        localStorage.setItem(commentedKey(slug), "1");
        setAlreadyCommented(true);
        setFormOpen(false);
        toast.error("You've already commented on this post.");
      } else if (result.error) {
        toast.error(result.error);
      } else if (result.fieldErrors) {
        toast.error("Please fix the errors and try again.");
      }
    });
  };

  return (
    <section id="comments" aria-label="Comments" className="mt-14 pt-10 border-t border-white/6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-display text-xl font-semibold text-white/80 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary/60" aria-hidden="true" />
          {comments.length > 0
            ? `${comments.length} Comment${comments.length > 1 ? "s" : ""}`
            : "Comments"}
        </h2>

        {alreadyCommented ? (
          /* Already commented — show badge instead of toggle */
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/80">
            <CheckCircle2 className="w-3.5 h-3.5" />
            You&apos;ve commented
          </div>
        ) : (
          <button
            onClick={() => setFormOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-mono transition-all duration-200 border",
              formOpen
                ? "bg-primary/10 border-primary/25 text-primary"
                : "bg-white/4 border-white/8 text-white/50 hover:text-white/80 hover:border-white/15"
            )}
          >
            {formOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {formOpen ? "Cancel" : "Leave a comment"}
          </button>
        )}
      </div>

      {/* Collapsible form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 p-5 rounded-2xl border border-white/8 bg-white/2 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input {...register("name")} placeholder="Your name" className={inputClass} aria-label="Your name" />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register("email")} type="email" placeholder="Email (not shown publicly)" className={inputClass} aria-label="Email address" />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <textarea
              {...register("message")}
              placeholder="Share your thoughts…"
              rows={4}
              className={cn(inputClass, "resize-none")}
              aria-label="Your comment"
            />
            {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs text-white/35 font-mono mb-1.5">Rating</p>
              <StarRating value={rating} onChange={(v) => setValue("rating", v)} />
              {errors.rating && <p className="mt-1 text-xs text-red-400">{errors.rating.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Posting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Post Comment
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-white/20 font-mono">
            A unique avatar will be auto-generated for your comment.
          </p>
        </form>
      )}

      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c) => <CommentCard key={c.id} comment={c} />)}
        </div>
      ) : (
        <div className="text-center py-10">
          <MessageSquare className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="text-sm text-white/30 font-mono">No comments yet — be the first!</p>
        </div>
      )}
    </section>
  );
}
