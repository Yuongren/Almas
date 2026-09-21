import { useEffect, useState } from "react";
import {
  PenSquare,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Tag,
  FolderPlus,
  X,
  Flag,
  CheckCircle2,
  MessageSquare,
  Globe,
  UserCircle2,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "/api";

type Category = { id: string; name: string; slug: string };

type PostStatus = "draft" | "pending" | "published" | "archived";

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image_path: string | null;
  author_name: string;
  author_avatar_path: string | null;
  category_id: string | null;
  tags: string[];
  status: PostStatus;
  is_public_submission: boolean;
  flagged: boolean;
  created_at: string;
  blog_categories?: Category | null;
};

type CommentStatus = "pending" | "approved" | "flagged";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  status: CommentStatus;
  created_at: string;
  blog_posts?: { id: string; title: string; slug: string } | null;
};

const STATUS_STYLES: Record<PostStatus, { bg: string; fg: string; label: string }> = {
  draft: { bg: "#1e293b", fg: "#cbd5e1", label: "Draft" },
  pending: { bg: "#3f2d0a", fg: "#fbbf24", label: "Pending review" },
  published: { bg: "#123524", fg: "#34d399", label: "Published" },
  archived: { bg: "#2a1030", fg: "#c084fc", label: "Archived" },
};

const COMMENT_STYLES: Record<CommentStatus, { bg: string; fg: string }> = {
  pending: { bg: "#3f2d0a", fg: "#fbbf24" },
  approved: { bg: "#123524", fg: "#34d399" },
  flagged: { bg: "#450a0a", fg: "#fca5a5" },
};

const emptyForm = {
  id: null as string | null,
  title: "",
  content: "",
  author_name: "",
  category_id: "",
  tags: "",
  status: "draft" as PostStatus,
  featured_image_path: "" as string | null,
  featured_image_preview: "" as string,
  author_avatar_path: "" as string | null,
  author_avatar_preview: "" as string,
};

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");

  const [newCategoryName, setNewCategoryName] = useState("");

  const [postFilter, setPostFilter] = useState<"all" | PostStatus>("all");

  async function loadPosts() {
    setLoadingPosts(true);
    try {
      const res = await fetch(`${API_URL}/admin/blog/posts`);
      const data = await res.json();
      setPosts(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }

  async function loadComments() {
    setLoadingComments(true);
    try {
      const res = await fetch(`${API_URL}/admin/blog/comments`);
      const data = await res.json();
      setComments(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to load comments:", error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch(`${API_URL}/blog/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data.items) ? data.items : []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  }

  useEffect(() => {
    loadPosts();
    loadComments();
    loadCategories();
  }, []);

  // =====================================================
  // CATEGORIES
  // =====================================================

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/admin/blog/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add category.");
      setNewCategoryName("");
      await loadCategories();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to add category.");
    }
  }

  async function handleDeleteCategory(category: Category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/blog/categories/${category.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category.");
      await loadCategories();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete category.");
    }
  }

  // =====================================================
  // IMAGE UPLOADS
  // =====================================================

  async function uploadImage(file: File): Promise<{ path: string; publicUrl: string } | null> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const res = await fetch(`${API_URL}/admin/blog/upload-image`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Image upload failed.");
    return { path: data.path, publicUrl: data.publicUrl };
  }

  async function handleFeaturedImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFeatured(true);
      const result = await uploadImage(file);
      if (result) {
        setForm((f) => ({
          ...f,
          featured_image_path: result.path,
          featured_image_preview: result.publicUrl,
        }));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload image.");
    } finally {
      setUploadingFeatured(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const result = await uploadImage(file);
      if (result) {
        setForm((f) => ({
          ...f,
          author_avatar_path: result.path,
          author_avatar_preview: result.publicUrl,
        }));
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to upload avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  // =====================================================
  // CREATE / UPDATE POST
  // =====================================================

  function loadPostIntoForm(post: Post) {
    setForm({
      id: post.id,
      title: post.title,
      content: post.content,
      author_name: post.author_name,
      category_id: post.category_id || "",
      tags: post.tags.join(", "),
      status: post.status,
      featured_image_path: post.featured_image_path,
      featured_image_preview: "",
      author_avatar_path: post.author_avatar_path,
      author_avatar_preview: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
  }

  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.title.trim() || !form.content.trim() || !form.author_name.trim()) {
      setMessage("Title, content and author name are required.");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      author_name: form.author_name.trim(),
      category_id: form.category_id || null,
      tags,
      status: form.status,
      featured_image_path: form.featured_image_path || undefined,
      author_avatar_path: form.author_avatar_path || undefined,
    };

    try {
      setSaving(true);

      const isEdit = Boolean(form.id);
      const res = await fetch(
        isEdit
          ? `${API_URL}/admin/blog/posts/${form.id}`
          : `${API_URL}/admin/blog/posts`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post.");

      setMessage(isEdit ? "Post updated." : "Post created.");
      resetForm();
      await loadPosts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // POST ACTIONS: status, flag, delete
  // =====================================================

  async function updatePostStatus(post: Post, status: PostStatus) {
    try {
      const res = await fetch(`${API_URL}/admin/blog/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      setPosts((current) =>
        current.map((p) => (p.id === post.id ? { ...p, status } : p))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status.");
    }
  }

  async function toggleFlag(post: Post) {
    try {
      const res = await fetch(`${API_URL}/admin/blog/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flagged: !post.flagged }),
      });
      if (!res.ok) throw new Error("Failed to update flag.");
      setPosts((current) =>
        current.map((p) => (p.id === post.id ? { ...p, flagged: !p.flagged } : p))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update flag.");
    }
  }

  async function deletePost(post: Post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`${API_URL}/admin/blog/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post.");
      setPosts((current) => current.filter((p) => p.id !== post.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete post.");
    }
  }

  // =====================================================
  // COMMENT ACTIONS
  // =====================================================

  async function updateCommentStatus(comment: Comment, status: CommentStatus) {
    try {
      const res = await fetch(`${API_URL}/admin/blog/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update comment.");
      setComments((current) =>
        current.map((c) => (c.id === comment.id ? { ...c, status } : c))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update comment.");
    }
  }

  async function deleteComment(comment: Comment) {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/blog/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete comment.");
      setComments((current) => current.filter((c) => c.id !== comment.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete comment.");
    }
  }

  const filteredPosts =
    postFilter === "all" ? posts : posts.filter((p) => p.status === postFilter);

  const pendingCount = posts.filter((p) => p.status === "pending").length;
  const pendingCommentCount = comments.filter((c) => c.status === "pending").length;

  return (
    <div style={{ display: "grid", gap: 28 }}>
      {/* =====================================================
          CATEGORY MANAGER
      ===================================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <FolderPlus size={18} />
          <h2 style={sectionTitleStyle}>Categories</h2>
        </div>

        <form onSubmit={handleAddCategory} style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button type="submit" style={primaryButtonStyle}>
            Add
          </button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.length === 0 && (
            <span style={{ color: "#64748b", fontSize: 13 }}>No categories yet.</span>
          )}
          {categories.map((cat) => (
            <span
              key={cat.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#0f172a",
                border: "1px solid #334155",
                fontSize: 12,
              }}
            >
              {cat.name}
              <X
                size={12}
                style={{ cursor: "pointer", color: "#94a3b8" }}
                onClick={() => handleDeleteCategory(cat)}
              />
            </span>
          ))}
        </div>
      </section>

      {/* =====================================================
          POST EDITOR
      ===================================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <PenSquare size={18} />
          <h2 style={sectionTitleStyle}>{form.id ? "Edit Post" : "Write New Post"}</h2>
          {form.id && (
            <button onClick={resetForm} style={{ ...ghostButtonStyle, marginLeft: "auto" }}>
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmitPost} style={{ display: "grid", gap: 14 }}>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Post title"
            style={inputStyle}
          />

          <textarea
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Write the article content here..."
            rows={8}
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              placeholder="Author name"
              style={inputStyle}
            />

            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              style={inputStyle}
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tag size={14} style={{ color: "#94a3b8" }} />
            <input
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="Tags, comma separated (e.g. music, updates)"
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Featured image */}
            <div>
              <label style={labelStyle}>
                <ImageIcon size={13} /> Featured image
              </label>
              <input type="file" accept="image/*" onChange={handleFeaturedImageChange} />
              {uploadingFeatured && (
                <p style={hintStyle}>Uploading...</p>
              )}
              {(form.featured_image_preview || form.featured_image_path) && !uploadingFeatured && (
                <p style={hintStyle}>Image attached ✓</p>
              )}
            </div>

            {/* Author avatar */}
            <div>
              <label style={labelStyle}>
                <UserCircle2 size={13} /> Author avatar
              </label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              {uploadingAvatar && <p style={hintStyle}>Uploading...</p>}
              {(form.author_avatar_preview || form.author_avatar_path) && !uploadingAvatar && (
                <p style={hintStyle}>Avatar attached ✓</p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 13, color: "#94a3b8" }}>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as PostStatus }))
              }
              style={{ ...inputStyle, width: "auto" }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <button type="submit" disabled={saving} style={primaryButtonStyle}>
            {saving ? "Saving..." : form.id ? "Update Post" : "Create Post"}
          </button>

          {message && <p style={{ color: "#fbbf24", margin: 0 }}>{message}</p>}
        </form>
      </section>

      {/* =====================================================
          POSTS LIST
      ===================================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>
            Posts {pendingCount > 0 && <PendingBadge count={pendingCount} />}
          </h2>

          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {(["all", "draft", "pending", "published", "archived"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPostFilter(f)}
                style={{
                  ...ghostButtonStyle,
                  background: postFilter === f ? "#1e293b" : "transparent",
                  border: postFilter === f ? "1px solid #f59e0b" : "1px solid #334155",
                  color: postFilter === f ? "#fbbf24" : "#94a3b8",
                  textTransform: "capitalize",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loadingPosts ? (
          <EmptyState text="Loading posts..." />
        ) : filteredPosts.length === 0 ? (
          <EmptyState text="No posts here yet." />
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filteredPosts.map((post) => {
              const style = STATUS_STYLES[post.status];
              return (
                <div key={post.id} style={rowCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <h3 style={{ margin: 0, fontSize: 16 }}>{post.title}</h3>
                        <Badge bg={style.bg} fg={style.fg}>{style.label}</Badge>
                        {post.is_public_submission && (
                          <Badge bg="#1e2a4a" fg="#60a5fa">
                            <Globe size={11} style={{ marginRight: 4 }} />
                            Public submission
                          </Badge>
                        )}
                        {post.flagged && (
                          <Badge bg="#450a0a" fg="#fca5a5">
                            <Flag size={11} style={{ marginRight: 4 }} />
                            Flagged
                          </Badge>
                        )}
                      </div>
                      <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: 13 }}>
                        By {post.author_name} · {post.tags.join(", ") || "no tags"} ·{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    <button onClick={() => loadPostIntoForm(post)} style={ghostButtonStyle}>
                      <PenSquare size={13} /> Edit
                    </button>

                    {post.status !== "published" && (
                      <button
                        onClick={() => updatePostStatus(post, "published")}
                        style={{ ...ghostButtonStyle, borderColor: "#34d399", color: "#34d399" }}
                      >
                        <CheckCircle2 size={13} /> Publish
                      </button>
                    )}

                    {post.status === "published" && (
                      <button onClick={() => updatePostStatus(post, "draft")} style={ghostButtonStyle}>
                        Unpublish
                      </button>
                    )}

                    {post.status !== "archived" && (
                      <button onClick={() => updatePostStatus(post, "archived")} style={ghostButtonStyle}>
                        Archive
                      </button>
                    )}

                    <button
                      onClick={() => toggleFlag(post)}
                      style={{
                        ...ghostButtonStyle,
                        borderColor: post.flagged ? "#f87171" : "#334155",
                        color: post.flagged ? "#f87171" : "#94a3b8",
                      }}
                    >
                      <Flag size={13} /> {post.flagged ? "Unflag" : "Flag"}
                    </button>

                    <button onClick={() => deletePost(post)} style={dangerButtonStyle}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* =====================================================
          COMMENT MODERATION
      ===================================================== */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <MessageSquare size={18} />
          <h2 style={sectionTitleStyle}>
            Comments {pendingCommentCount > 0 && <PendingBadge count={pendingCommentCount} />}
          </h2>
        </div>

        {loadingComments ? (
          <EmptyState text="Loading comments..." />
        ) : comments.length === 0 ? (
          <EmptyState text="No comments yet." />
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {comments.map((comment) => {
              const style = COMMENT_STYLES[comment.status];
              return (
                <div key={comment.id} style={rowCardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong>{comment.author_name}</strong>
                        <Badge bg={style.bg} fg={style.fg}>{comment.status}</Badge>
                      </div>
                      <p style={{ margin: "6px 0", color: "#cbd5e1", fontSize: 14 }}>{comment.content}</p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
                        On "{comment.blog_posts?.title ?? "Unknown post"}" ·{" "}
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {comment.status !== "approved" && (
                      <button
                        onClick={() => updateCommentStatus(comment, "approved")}
                        style={{ ...ghostButtonStyle, borderColor: "#34d399", color: "#34d399" }}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                    )}
                    {comment.status !== "flagged" && (
                      <button
                        onClick={() => updateCommentStatus(comment, "flagged")}
                        style={{ ...ghostButtonStyle, borderColor: "#f87171", color: "#f87171" }}
                      >
                        <Flag size={13} /> Flag
                      </button>
                    )}
                    <button onClick={() => deleteComment(comment)} style={dangerButtonStyle}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// =====================================================
// SMALL UI HELPERS
// =====================================================

function Badge({
  bg,
  fg,
  children,
}: {
  bg: string;
  fg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: bg,
        color: fg,
      }}
    >
      {children}
    </span>
  );
}

function PendingBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        marginLeft: 8,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        background: "#3f2d0a",
        color: "#fbbf24",
      }}
    >
      {count} pending
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 32,
        textAlign: "center",
        color: "#94a3b8",
        background: "#020617",
        borderRadius: 12,
      }}
    >
      {text}
    </div>
  );
}

// =====================================================
// SHARED STYLES
// =====================================================

const sectionStyle: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 18,
  padding: 24,
};

const rowCardStyle: React.CSSProperties = {
  background: "#020617",
  border: "1px solid #1e293b",
  borderRadius: 14,
  padding: 18,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 19,
  display: "flex",
  alignItems: "center",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  color: "#94a3b8",
  marginBottom: 6,
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#34d399",
  margin: "6px 0 0",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 10,
  border: "none",
  background: "#f59e0b",
  color: "#111827",
  fontWeight: 700,
  cursor: "pointer",
};

const ghostButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#cbd5e1",
  cursor: "pointer",
};

const dangerButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 600,
  border: "1px solid #7f1d1d",
  background: "#450a0a",
  color: "#fca5a5",
  cursor: "pointer",
};
