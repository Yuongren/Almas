import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { AudioWave } from "@/components/AudioWave";
import { StarRating } from "@/components/StarRating";
import {
  Sparkles,
  MessageSquarePlus,
  Star,
  X,
  ArrowRight,
  Check,
  Languages,
  ShieldCheck,
  Radio,
} from "lucide-react";
import {
  fetchReviews,
  submitReview,
  resolveImageUrl,
  uploadReviewAvatar,
  type Review,
} from "@/lib/reviews";
import { capabilities, audiences, principles } from "@/lib/siteContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Almas Skika" },
      {
        name: "description",
        content:
          "Almas Skika is a Kenyan audio-branding and voice-communication studio. We turn phone interactions into branded audio experiences.",
      },
    ],
  }),
  component: AboutPage,
});

const principleIcons = [Languages, ShieldCheck, Radio];

const positioning = [
  { t: "Creative agencies", d: "Concepts, scripts and campaigns.", highlight: false },
  {
    t: "Almas Skika",
    d: "The message, voice, language, sound and brand experience — with technical activation through licensed partners.",
    highlight: true,
  },
  { t: "Telecom / VAS providers", d: "Platforms, activation and infrastructure.", highlight: false },
];

function AboutPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);

  useEffect(() => {
    fetchReviews()
      .then(setReviews)
      .finally(() => setLoadingReviews(false));
  }, []);

  const rated = reviews.filter((r) => r.rating);
  const averageRating =
    rated.length > 0 ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length : 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 bg-hero overflow-hidden bg-grain">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="ambient-blob absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="ambient-blob absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-5">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            About Almas Skika
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            We make your phone system <br />
            <span className="text-shimmer">sound like your brand.</span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground">
            Almas Skika is a Kenyan audio-branding and voice-communication studio. We turn phone
            interactions into branded audio experiences.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="btn-sheen group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              Reach out to us <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition"
            >
              See what we make
            </Link>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Our story</div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Every phone interaction can become a brand experience.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Almas Skika creates professional caller tunes, business greetings, IVR/PABX voice
              prompts, on-hold messages, campaign audio and multilingual voice content. We replace
              silence or a generic ring-back with a message that welcomes, informs and sounds like
              you.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Callers already expect audio while they wait. Our job isn't to explain that it exists
              — it's to make it better: better scripting, better voices, better localization and a
              better customer experience.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <figure className="p-8 rounded-3xl glass shadow-card border-gold/30">
              <AudioWave bars={24} variant="gold" className="h-12 w-full mb-6" />
              <blockquote className="font-display text-xl md:text-2xl leading-snug">
                “We don't just make your phone system talk. We make it sound like your brand.”
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-widest text-gold">
                Our core promise
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* WHERE WE FIT */}
      <section className="py-14 md:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="Where we fit"
            title={<>The specialist <span className="text-gold-gradient">in the middle.</span></>}
            description="We sit between a creative agency and a telecom/VAS provider — owning the creative and the customer experience, and partnering for technical activation."
          />
          <div className="grid md:grid-cols-3 gap-4 items-stretch">
            {positioning.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <div
                  className={`h-full p-6 rounded-2xl ${
                    p.highlight
                      ? "glass border-gold/40 shadow-gold md:-my-2 md:py-8"
                      : "border border-border/60 bg-card/40"
                  }`}
                >
                  <div className={`text-xs uppercase tracking-widest mb-2 ${p.highlight ? "text-gold" : "text-muted-foreground"}`}>
                    {p.t}
                  </div>
                  <p className={p.highlight ? "text-sm" : "text-sm text-muted-foreground"}>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="What we do"
            title="Four capabilities, one voice."
            description="Creative scripting, professional voice-over, audio production and telecom-ready delivery — combined under one roof."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <div className="card-interactive h-full p-6 rounded-2xl glass shadow-card">
                  <div className="h-11 w-11 rounded-xl bg-gold-gradient grid place-items-center shadow-gold mb-4">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES + WHO WE SERVE */}
      <section className="py-14 md:py-20 bg-mesh relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="What we stand for"
            title="How we work."
            description="A few commitments we hold ourselves to on every project."
          />
          <div className="grid md:grid-cols-3 gap-4">
            {principles.map((v, i) => {
              const Icon = principleIcons[i];
              return (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="h-full p-6 rounded-2xl glass shadow-card hover:border-gold/40 transition">
                    <div className="h-10 w-10 rounded-xl glass grid place-items-center text-gold mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={150} className="mt-10 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Who we serve</div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {audiences.map((a) => (
                <span key={a} className="px-4 py-2 rounded-full glass text-sm hover:border-gold/40 hover:text-gold transition cursor-default">
                  <Check className="inline h-3.5 w-3.5 mr-2 text-gold" />{a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS / FEEDBACK — the only place reviews appear on the site */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            eyebrow="What people say"
            title="Feedback from our community."
            description="Have you worked with us or heard our audio? Share your experience — approved feedback appears here."
            action={
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="btn-sheen inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
              >
                <MessageSquarePlus className="h-4 w-4" /> Leave Feedback
              </button>
            }
          />

          {reviews.length > 0 && rated.length > 0 && (
            <Reveal className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <StarRating value={Math.round(averageRating)} readOnly size={16} />
              <span>
                {averageRating.toFixed(1)} average · {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>
            </Reveal>
          )}

          {loadingReviews ? (
            <p className="text-center text-muted-foreground py-8">Loading feedback…</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 rounded-2xl glass">
              <p className="text-muted-foreground">
                No feedback yet — be the first to share your experience.
              </p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {reviews.slice(0, visibleReviewCount).map((review, i) => {
                  const avatar = resolveImageUrl(review.author_avatar_path);
                  return (
                    <Reveal key={review.id} delay={(i % 3) * 80}>
                      <figure className="p-6 rounded-2xl glass shadow-card hover:border-gold/40 transition flex flex-col h-full">
                        {review.rating && (
                          <div className="flex gap-1 mb-3" aria-label={`${review.rating} star rating`}>
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-4 w-4 ${
                                  idx < review.rating! ? "fill-gold text-gold" : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <blockquote className="text-sm leading-relaxed flex-1">"{review.content}"</blockquote>
                        <figcaption className="mt-5 pt-4 border-t border-border/50 flex items-center gap-3">
                          {avatar ? (
                            <img src={avatar} alt={review.author_name} className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-secondary/40 flex items-center justify-center text-xs font-semibold">
                              {review.author_name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-semibold">{review.author_name}</span>
                        </figcaption>
                      </figure>
                    </Reveal>
                  );
                })}
              </div>

              {reviews.length > 3 && (
                <div className="flex justify-center mt-6">
                  {visibleReviewCount < reviews.length ? (
                    <button
                      onClick={() => setVisibleReviewCount((c) => c + 3)}
                      className="px-6 py-3 rounded-full glass hover:border-gold/40 transition text-sm font-semibold"
                    >
                      Show more feedback
                    </button>
                  ) : (
                    <button
                      onClick={() => setVisibleReviewCount(3)}
                      className="px-6 py-3 rounded-full glass hover:border-gold/40 transition text-sm font-semibold"
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

      {/* CLOSING CTA */}
      <section className="py-14 md:py-20 relative overflow-hidden bg-card/30">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <Reveal className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Let's make your brand <span className="text-gold-gradient">heard.</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tell us about your project — we'd love to help you hear your brand.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="btn-sheen group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              Reach out to us <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full glass font-semibold hover:bg-secondary/50 transition"
            >
              View pricing
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />

      {showFeedbackModal && (
        <FeedbackModal
          onClose={() => setShowFeedbackModal(false)}
          onSubmitted={() => setShowFeedbackModal(false)}
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
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      setStatus("Thanks! Your feedback has been submitted and is awaiting review.");
      setName("");
      setContent("");
      setRating(5);
      setAvatarFile(null);
      setTimeout(() => onSubmitted(), 1600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-background/90 backdrop-blur-md overflow-y-auto p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-auto mt-16 mb-10 p-6 rounded-2xl glass border border-gold/30 shadow-gold"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl">Leave Feedback</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 grid place-items-center rounded-full glass"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Your rating</label>
            <StarRating value={rating} onChange={setRating} size={22} />
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={5}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-vertical"
          />

          <label className="text-sm text-muted-foreground">
            Profile picture (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              className="block mt-2"
            />
          </label>

          {status && <p className="text-sm text-gold">{status}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Your feedback will be reviewed by our team before it appears publicly.
          </p>
        </form>
      </div>
    </div>
  );
}
