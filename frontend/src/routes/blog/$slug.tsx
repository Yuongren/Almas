import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2, Send } from "lucide-react";
import {
  type BlogComment,
  type BlogPost,
  fetchComments,
  fetchPost,
  resolveImageUrl,
  submitComment,
  toggleLike,
} from "@/lib/blog";

function getLikedPosts(): Set<string> {
  try {
    const raw = localStorage.getItem("liked_blog_posts");
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveLikedPosts(ids: Set<string>) {
  localStorage.setItem("liked_blog_posts", JSON.stringify(Array.from(ids)));
}

function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeBusy, setLikeBusy] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchPost(slug);
      setPost(data);

      if (data) {
        setLikeCount(data.like_count);
        setLiked(getLikedPosts().has(data.id));
        const commentsData = await fetchComments(data.id);
        setComments(commentsData);
      }

      setLoading(false);
    })();
  }, [slug]);

  async function handleLike() {
    if (!post || likeBusy) return;

    try {
      setLikeBusy(true);
      const result = await toggleLike(post.id);
      setLiked(result.liked);
      setLikeCount(result.like_count);

      const likedIds = getLikedPosts();
      if (result.liked) likedIds.add(post.id);
      else likedIds.delete(post.id);
      saveLikedPosts(likedIds);
    } catch (error) {
      console.error("Failed to like post:", error);
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
        return;
      } catch {
        // fall through to copy
      }
    }

    await navigator.clipboard.writeText(url);
    setCopyStatus("Link copied!");
    setTimeout(() => setCopyStatus(null), 2000);
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;

    setCommentStatus(null);

    if (!commentName.trim() || !commentText.trim()) {
      setCommentStatus("Please enter your name and a comment.");
      return;
    }

    try {
      setSubmittingComment(true);
      await submitComment(post.id, {
        author_name: commentName.trim(),
        content: commentText.trim(),
      });
      setCommentStatus("Thanks! Your comment will appear once approved.");
      setCommentName("");
      setCommentText("");
    } catch (error) {
      setCommentStatus(
        error instanceof Error ? error.message : "Failed to submit comment."
      );
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return <p className="text-center text-muted-foreground py-24">Loading article…</p>;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Article not found.</p>
        <Link to="/blog" className="text-gold underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  const image = resolveImageUrl(post.featured_image_path);
  const avatar = resolveImageUrl(post.author_avatar_path);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {image && (
          <div className="rounded-2xl overflow-hidden mb-6 h-64 md:h-80">
            <img src={image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {post.blog_categories && (
          <span className="text-xs uppercase tracking-widest text-gold">
            {post.blog_categories.name}
          </span>
        )}

        <h1 className="font-display font-bold text-2xl md:text-4xl mt-2 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 mb-8">
          {avatar ? (
            <img src={avatar} alt={post.author_name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-secondary/40 flex items-center justify-center text-sm">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{post.author_name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.published_at ?? post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
          {post.content}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full glass text-xs text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement */}
        <div className="flex items-center gap-3 py-4 border-y border-border/50 mb-10">
          <button
            onClick={handleLike}
            disabled={likeBusy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass transition ${
              liked ? "border-gold/60 text-gold" : "hover:border-gold/40"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-gold text-gold" : ""}`} /> {likeCount}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:border-gold/40 transition"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>

          {copyStatus && <span className="text-xs text-gold">{copyStatus}</span>}
        </div>

        {/* Comments */}
        <section>
          <h2 className="font-display font-bold text-xl mb-4">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>

          {comments.length === 0 ? (
            <p className="text-muted-foreground text-sm mb-8">Be the first to comment.</p>
          ) : (
            <div className="grid gap-4 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-xl glass">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleCommentSubmit} className="grid gap-3">
            <input
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              placeholder="Your name"
              className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-vertical"
            />
            {commentStatus && <p className="text-sm text-gold">{commentStatus}</p>}
            <button
              type="submit"
              disabled={submittingComment}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition disabled:opacity-60 w-fit"
            >
              <Send className="h-4 w-4" /> {submittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});
