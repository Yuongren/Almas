import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, PenSquare, X, Heart, ChevronDown, Check, BookOpen } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import {
  type BlogCategory,
  type BlogPost,
  fetchCategories,
  fetchPosts,
  resolveImageUrl,
  submitPost,
  uploadBlogImage,
} from "@/lib/blog";

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [postsData, featuredData, categoriesData] = await Promise.all([
        fetchPosts({
          category: activeCategory ?? undefined,
          search: search || undefined,
        }),
        fetchPosts({ featured: true }),
        fetchCategories(),
      ]);
      setPosts(postsData);
      setFeatured(featuredData);
      setCategories(categoriesData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadAll();
  }

  const featuredIds = useMemo(() => new Set(featured.map((p) => p.id)), [featured]);
  const recentPosts = posts.filter((p) => !featuredIds.has(p.id));
  const showFeaturedSection = featured.length > 0 && !activeCategory && !search;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO INTRO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-hero overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-neon/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <BookOpen className="h-3.5 w-3.5 text-gold" />
            Stories, updates & studio notes
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Voices from <span className="text-gold-gradient">Almas Skika</span> <br />
            and our community.
          </h1>

          <p className="mt-5 max-w-xl mx-auto text-base md:text-lg text-muted-foreground">
            News from the studio, tips on telecom audio, and stories shared by the people we work with.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowWriteModal(true)}
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-gold-gradient text-primary-foreground font-semibold shadow-gold hover:scale-[1.02] transition"
            >
              <PenSquare className="h-4 w-4" /> Write a Post
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-full glass bg-input/40 outline-none focus:border-gold/60"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-full glass hover:border-gold/40 transition text-sm font-semibold"
          >
            Search
          </button>
        </form>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              activeCategory === null
                ? "bg-gold-gradient text-primary-foreground"
                : "glass hover:border-gold/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === cat.slug
                  ? "bg-gold-gradient text-primary-foreground"
                  : "glass hover:border-gold/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-16">Loading articles…</p>
        ) : (
          <>
            {showFeaturedSection && (
              <section className="mb-12">
                <h2 className="font-display font-bold text-xl mb-4">Featured</h2>
                <div className="grid md:grid-cols-3 gap-5">
                  {featured.map((post) => (
                    <PostCard key={post.id} post={post} large />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display font-bold text-xl mb-4">
                {activeCategory || search ? "Results" : "Recent Posts"}
              </h2>
              {recentPosts.length === 0 ? (
                <p className="text-muted-foreground py-10 text-center">
                  No articles found.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <Footer />

      {showWriteModal && (
        <WritePostModal
          categories={categories}
          onClose={() => setShowWriteModal(false)}
          onSubmitted={() => setShowWriteModal(false)}
        />
      )}
    </div>
  );
}

function PostCard({ post, large = false }: { post: BlogPost; large?: boolean }) {
  const image = resolveImageUrl(post.featured_image_path);
  const avatar = resolveImageUrl(post.author_avatar_path);
  const excerpt =
    post.content.length > 140 ? `${post.content.slice(0, 140)}…` : post.content;

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group rounded-2xl glass overflow-hidden hover:border-gold/40 transition flex flex-col"
    >
      <div className={`bg-hero ${large ? "h-48" : "h-36"} overflow-hidden`}>
        {image ? (
          <img
            src={image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        {post.blog_categories && (
          <span className="text-[10px] uppercase tracking-widest text-gold">
            {post.blog_categories.name}
          </span>
        )}
        <h3 className="font-display font-semibold text-base line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{excerpt}</p>
        <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-2">
          <div className="flex items-center gap-2 min-w-0">
            {avatar ? (
              <img src={avatar} alt={post.author_name} className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-secondary/40 flex items-center justify-center text-[10px]">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground truncate">{post.author_name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="h-3 w-3" /> {post.like_count}
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategoryDropdown({
  categories,
  value,
  onChange,
}: {
  categories: BlogCategory[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = categories.find((c) => c.id === value);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 text-left"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.name : "No category"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full rounded-xl glass border border-gold/20 shadow-card overflow-hidden max-h-56 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary/30 transition text-left"
          >
            No category
            {!value && <Check className="h-4 w-4 text-gold" />}
          </button>

          {categories.length === 0 ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">No categories yet.</p>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onChange(cat.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary/30 transition text-left"
              >
                {cat.name}
                {value === cat.id && <Check className="h-4 w-4 text-gold" />}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function WritePostModal({
  categories,
  onClose,
  onSubmitted,
}: {
  categories: BlogCategory[];
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!title.trim() || !content.trim() || !authorName.trim()) {
      setStatus("Title, content and your name are required.");
      return;
    }

    try {
      setSubmitting(true);

      let author_avatar_path: string | undefined;
      if (avatarFile) {
        const uploaded = await uploadBlogImage(avatarFile);
        author_avatar_path = uploaded?.path;
      }

      let featured_image_path: string | undefined;
      if (featuredImageFile) {
        const uploaded = await uploadBlogImage(featuredImageFile);
        featured_image_path = uploaded?.path;
      }

      await submitPost({
        title: title.trim(),
        content: content.trim(),
        author_name: authorName.trim(),
        category_id: categoryId || undefined,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        author_avatar_path,
        featured_image_path,
      });

      setStatus("Thanks! Your post has been submitted and is awaiting review.");
      setTitle("");
      setContent("");
      setAuthorName("");
      setCategoryId("");
      setTags("");
      setAvatarFile(null);
      setFeaturedImageFile(null);

      setTimeout(() => onSubmitted(), 1600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to submit post.");
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
        className="max-w-xl mx-auto mt-10 mb-10 p-6 rounded-2xl glass border border-gold/30 shadow-gold"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-xl">Write a Post</h2>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article..."
            rows={7}
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60 resize-vertical"
          />

          <input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />

          <CategoryDropdown
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
          />

          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags, comma separated (optional)"
            className="px-4 py-3 rounded-xl glass bg-input/40 outline-none focus:border-gold/60"
          />

          <label className="text-sm text-muted-foreground">
            Article image (optional) — shown as the post's cover photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFeaturedImageFile(e.target.files?.[0] ?? null)}
              className="block mt-2"
            />
          </label>

          <label className="text-sm text-muted-foreground">
            Your photo (optional) — shown next to your name as the author
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
            {submitting ? "Submitting..." : "Submit for Review"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Your post will be reviewed by our team before it appears publicly.
          </p>
        </form>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
});
