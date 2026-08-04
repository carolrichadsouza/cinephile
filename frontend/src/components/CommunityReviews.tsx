import { useEffect, useState } from "react";
import { format } from "date-fns";
import { User } from "lucide-react";

import { getMovieReviews, type MovieReview } from "../lib/reviews";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Rating } from "./ui/rating";

function isoDateToDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function ReviewCard({ review }: { review: MovieReview }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-muted">
            <User className="size-3.5 text-muted-foreground" />
          </span>

          <span className="text-sm font-semibold">
            {review.displayName || review.username}
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          {format(
            isoDateToDate(review.watchedDate.slice(0, 10)),
            "MMM d, yyyy",
          )}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
          {review.review}
        </p>

        {review.rating != null && (
          <span className="flex shrink-0 items-center gap-1.5">
            <Rating rating={review.rating} />

            <span className="text-xs text-muted-foreground">
              {review.rating.toFixed(1)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function CommunityReviews({
  tmdbId,
}: {
  tmdbId: number;
}) {
  const [reviews, setReviews] = useState<MovieReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);

    getMovieReviews(tmdbId)
      .then((data) => {
        if (!cancelled) {
          setReviews(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [tmdbId]);

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading reviews...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet.
      </p>
    );
  }

  const previewReviews = reviews.slice(0, 2);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"}
        </p>

        {reviews.length > 2 && (
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={() => setIsDialogOpen(true)}
          >
            See all
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {previewReviews.map((review, index) => (
          <ReviewCard
            key={`${review.username}-${review.watchedDate}-${index}`}
            review={review}
          />
        ))}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="max-h-[85vh] border border-border bg-background sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Community Reviews</DialogTitle>

            <DialogDescription>
              All {reviews.length} reviews for this movie.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-2">
            {reviews.map((review, index) => (
              <ReviewCard
                key={`${review.username}-${review.watchedDate}-${index}`}
                review={review}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}