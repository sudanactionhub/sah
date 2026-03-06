import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Vite-based auto import of all blog page files in /pages/BlogPages
const blogModules = import.meta.glob('./BlogPages/*.{jsx,tsx}', { eager: true });

const blogPosts = Object.values(blogModules)
  .map((mod) => mod.blogMeta)
  .filter(Boolean)
  .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));

const BlogPostPage = () => {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog | Sudan Action Hub</title>
        <meta
          name="description"
          content="Read stories, campaign updates, research features, and field reflections from Sudan Action Hub."
        />
        <link rel="canonical" href="https://sudanactionhub.org/blog" />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wide mb-6">
                Sudan Action Hub Blog
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Stories, updates, and field reflections
              </h1>

              <p className="text-lg md:text-xl text-green-100 max-w-3xl leading-8">
                Explore campaign features, partner spotlights, advocacy insights, and articles
                highlighting the people and communities at the center of Sudan Action Hub’s work.
              </p>
            </motion.div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {featuredPost && (
            <section className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-8 items-stretch"
              >
                <Link
                  to={featuredPost.slug}
                  className="block overflow-hidden rounded-2xl bg-gray-100 min-h-[320px]"
                >
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="rounded-2xl border border-gray-200 bg-white p-8 lg:p-10 shadow-sm flex flex-col justify-center">
                  <div>
                    <Link to={featuredPost.slug}>
                      <Button className="bg-green-600 hover:bg-green-700 mb-8">
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-green-700 mb-4">
                    Featured Post
                  </p>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {featuredPost.title}
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-gray-600 mb-5">
                    <div className="inline-flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{featuredPost.dateDisplay}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-8 mb-6">
                    {featuredPost.excerpt}
                  </p>

                  
                </div>
              </motion.div>
            </section>
          )}

          <section>
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">All Posts</h3>
                <p className="text-gray-600">
                  Browse every feature, update, and campaign story published by Sudan Action Hub.
                </p>
              </div>
            </div>

            {blogPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h4>
                <p className="text-gray-600">
                  Add a post inside <span className="font-medium">src/pages/BlogPages</span> and
                  export its <span className="font-medium">blogMeta</span> object to have it appear
                  here automatically.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow"
                  >
                    <Link to={post.slug} className="block">
                      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-6">
                      {post.category && (
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-700 mb-3">
                          {post.category}
                        </p>
                      )}

                      <Link to={post.slug}>
                        <h4 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-green-800 transition-colors">
                          {post.title}
                        </h4>
                      </Link>

                      <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                        <div className="inline-flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{post.dateDisplay}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-7 mb-5 line-clamp-4">
                        {post.excerpt}
                      </p>

                      <Link
                        to={post.slug}
                        className="inline-flex items-center text-green-700 font-semibold hover:text-green-900 transition-colors"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default BlogPostPage;