"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Globe, Eye, Trash2, CheckCircle2, FileEdit } from "lucide-react";
import { mockDb } from "@/services/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function CmsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "pages">("posts");
  const [posts, setPosts] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  
  // Blog form state
  const [postTitle, setPostTitle] = useState("");
  const [postAuthor, setPostAuthor] = useState("Admin");
  
  // Page form state
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");

  useEffect(() => {
    mockDb.initialize();
    const cms = mockDb.getCms();
    setPosts(cms.posts || []);
    setPages(cms.pages || []);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
      </div>
    );
  }

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle) return;
    const newPost = mockDb.saveCmsPost({ title: postTitle, author: postAuthor, status: "Published" });
    setPosts(prev => [...prev, newPost]);
    setPostTitle("");
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle || !pageSlug) return;
    const newPage = mockDb.saveCmsPage({ title: pageTitle, slug: pageSlug, status: "Active" });
    setPages(prev => [...prev, newPage]);
    setPageTitle("");
    setPageSlug("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Content Management System</h1>
          <p className="text-sm text-muted-foreground font-medium">Create client blog announcements and customize static information pages.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === "posts" 
              ? "border-primary text-primary font-black bg-primary/5" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Blog Articles ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === "pages" 
              ? "border-primary text-primary font-black bg-primary/5" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Information Pages ({pages.length})
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Creation forms */}
        <Card className="border border-border shadow-sm h-fit">
          <CardContent className="p-5">
            {activeTab === "posts" ? (
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Publish Blog Entry</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="post-title" className="text-xs font-semibold">Article Title</Label>
                  <Input 
                    id="post-title" 
                    placeholder="e.g. Design Guidelines for Custom Jerseys" 
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-author" className="text-xs font-semibold">Author</Label>
                  <Input 
                    id="post-author" 
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="w-full text-xs h-9">
                  <Plus className="mr-1.5 h-4 w-4" /> Publish Article
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePageSubmit} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Create Custom Page</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="page-title" className="text-xs font-semibold">Page Title</Label>
                  <Input 
                    id="page-title" 
                    placeholder="e.g. Terms of Personalization" 
                    value={pageTitle}
                    onChange={(e) => {
                      setPageTitle(e.target.value);
                      setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="page-slug" className="text-xs font-semibold">Slug URL</Label>
                  <Input 
                    id="page-slug" 
                    placeholder="terms-of-personalization" 
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" size="sm" className="w-full text-xs h-9">
                  <Plus className="mr-1.5 h-4 w-4" /> Save Page
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Content list table */}
        <Card className="md:col-span-2 border border-border shadow-sm bg-card overflow-hidden">
          {activeTab === "posts" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                    <th className="p-3">Article Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Views</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {posts.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="p-3 font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span>{p.title}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{p.author}</td>
                      <td className="p-3 font-mono font-semibold">{p.views}</td>
                      <td className="p-3 text-muted-foreground">{p.date}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b bg-secondary/35 text-muted-foreground font-semibold">
                    <th className="p-3">Page Name</th>
                    <th className="p-3">URL Slug</th>
                    <th className="p-3">Last Modified</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30">
                      <td className="p-3 font-bold text-foreground flex items-center gap-2">
                        <Globe className="h-4.5 w-4.5 text-primary shrink-0" />
                        <span>{p.title}</span>
                      </td>
                      <td className="p-3 font-mono font-semibold text-muted-foreground">/{p.slug}</td>
                      <td className="p-3 text-muted-foreground">{p.lastModified}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
