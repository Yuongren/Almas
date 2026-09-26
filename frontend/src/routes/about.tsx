import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { StarRating } from "@/components/StarRating";
import {
  Sparkles,
  Target,
  Heart,
  ShieldCheck,
  MessageSquarePlus,
  Star,
  X,
} from "lucide-react";
import {
  fetchReviews,
  submitReview,
  resolveImageUrl,
  uploadReviewAvatar,
  type Review,
} from "@/lib/reviews";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Almas Skika" },
      {
        name: "description",
        content:
          "Almas Skika is a Nairobi-based telecom audio branding studio — the story, the values, and the people behind the sound.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: Target,
    title: "Precision",
    desc: "Every tune, greeting and voice over is mixed and mastered to broadcast standard before it ever reaches a phone.",
  },
  {
    icon: Heart,
    title: "Cultural fluency",
    desc: "We record in the languages our clients' audiences actually speak — because sound should feel like home.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    desc: "Telecom-certified delivery and fast turnarounds, so your campaign never waits on us.",
  },
];

function AboutPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);

  async function loadReviews() {
    try {
      setLoadingReviews(true);
      const data = await fetchReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }

  useEffect(() => {
    void loadReviews();
  }, []);

  const ratedReviews = reviews.filter(
    (review) => typeof review.rating === "number"
  );

  const averageRating =
    ratedReviews.length > 0
      ? ratedReviews.reduce(
          (sum, review) => sum + (review.rating ?? 0),
          0
        ) / ratedReviews.length
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Our story
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            We are <span className="text-gold-gradient">Almas Skika.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            A Nairobi-based audio studio dedicated to one craft: making Kenyan
            brands, churches and campaigns sound as good as they deserve — on
            every call, in every language.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
              Our mission
            </div>

            <h2 className="text-3xl md:text-5xl font-bold">
              Sound that carries meaning, <br />
              <span className="text-gold-gradient">not just noise.</span>
            </h2>

            <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Almas Skika started with a simple observation: the moment before
              someone hears your voice — a caller tune, a greeting, an IVR
              message — is a moment of trust. We treat that moment as seriously
              as any billboard or broadcast ad, because for millions of
              Kenyans, it's the first thing they hear from your brand.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="max-w-2xl mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
              What we stand for
            </div>

            <h2 className="text-3xl md:text-5xl font-bold">Our values.</h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 80}>
                <div className="p-7 rounded-2xl glass shadow-card hover:border-gold/40 transition h-full">
                  <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-5">
                    <value.icon className="h-5 w-5 text-primary-foreground" />
                  </div>

                  <h3 className="font-display font-semibold text-lg">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS / FEEDBACK */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="flex items-end justify-between gap-4 flex-wrap mb-4">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">
                What people say
              </div>

              <h2 className="text-3xl md:text-5xl font-bold">
                Feedback from our community.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Leave Feedback
            </button>
          </Reveal>

          {reviews.length > 0 && ratedReviews.length > 0 && (
            <Reveal className="flex items-center gap-2 mb-10 text-sm text-muted-foreground">
              <StarRating
                value={Math.round(averageRating)}
                readOnly
                size={16}
              />

              <span>
                {averageRating.toFixed(1)} average · {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>
            </Reveal>
          )}

          {loadingReviews ? (
            <p className="text-center text-muted-foreground py-10">
              Loading feedback…
            </p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass">
              <p className="text-muted-foreground">
                No feedback yet — be the first to share your experience.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.slice(0, visibleReviewCount).map((review, index) => {
                  const avatar = resolveImageUrl(
                    review.author_avatar_path
                  );

                  return (
                    <Reveal
                      key={review.id}
                      delay={(index % 3) * 80}
                    >
                      <figure className="p-6 rounded-2xl glass shadow-card hover:border-gold/40 transition flex flex-col h-full">
                        {review.rating && (
                          <div
                            className="flex gap-1 text-gold mb-3"
                            aria-label={`${review.rating} star rating`}
                          >
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <Star
                                key={starIndex}
                                className={`h-4 w-4 ${
                                  starIndex < review.rating!
                                    ? "fill-gold text-gold"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        <blockquote className="text-sm leading-relaxed flex-1">
                          "{review.content}"
                        </blockquote>

                        <figcaption className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={review.author_name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-secondary/40 flex items-center justify-center text-xs font-semibold">
                              {review.author_name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <span className="text-sm font-semibold">
                            {review.author_name}
                          </span>
                        </figcaption>
                      </figure>
                    </Reveal>
                  );
                })}
              </div>

              {reviews.length > 3 && (
                <div className="flex justify-center mt-8">
                  {visibleReviewCount < reviews.length ? (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleReviewCount((count) => count + 3)
                      }
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:border-gold/40 transition text-sm font-semibold"
                    >
                      Show more feedback
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setVisibleReviewCount(3)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:border-gold/40 transition text-sm font-semibold"
                    >
                      Show less
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />

      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmitted={async () => {
            setShowFeedbackModal(false);
            setVisibleReviewCount(3);
            await loadReviews();
          }}
        />
      )}
    </div>
  );
}

function FeedbackModal({
  onClose,
  onSubmitted,
}: {
  onClose: () => void;
  onSubmitted: () => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, submitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    if (!name.trim() || !content.trim()) {
      setStatus("Please enter your name and your feedback.");
      return;
    }

    try {
      setSubmitting(true);

      let author_avatar_path: string | undefined;

      if (avatarFile) {
        const uploaded = await uploadReviewAvatar(avatarFile);
        author_avatar_path = uploaded?.path;
      }

      await submitReview({
        author_name: name.trim(),
        content: content.trim(),
        rating,
        author_avatar_path,
      });

      setStatus(
        "Thanks! Your feedback has been submitted and is awaiting review."
      );

      setName("");
      setContent("");
      setRating(5);
      setAvatarFile(null);

      window.setTimeout(() => {
        void onSubmitted();
      }, 1600);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Failed to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-background/90 backdrop-blur-md overflow-y-auto p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-w-md mx-auto mt-16 mb-10 p-6 rounded-2xl glass border border-gold/30 shadow-gold"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="feedback-modal-title"
            className="font-display font-bold text-xl"
          >
            Leave Feedback
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close feedback form"
            className="h-9 w-9 grid place-items-center rounded-full glass disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="name"
            disabled={submitting}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 disabled:opacity-60"
          />

          <div>
            <label className="text-sm text-muted-foreground block mb-2">
              Your rating
            </label>

            <StarRating
              value={rating}
              onChange={setRating}
              size={22}
            />
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Tell us about your experience..."
            aria-label="Your feedback"
            rows={5}
            disabled={submitting}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-vertical disabled:opacity-60"
          />

          <label className="text-sm text-muted-foreground">
            Profile picture (optional)

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setAvatarFile(event.target.files?.[0] ?? null)
              }
              disabled={submitting}
              className="block mt-2"
            />
          </label>

          {status && (
            <p className="text-sm text-gold" role="status">
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Your feedback will be reviewed by our team before it appears
            publicly.
          </p>
        </form>
      </div>
    </div>
  );
}
