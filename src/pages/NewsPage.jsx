import react, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load news articles.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Latest News on Sudan | Sudan Action Hub</title>
        <meta name="description" content="Stay informed with the latest news, updates, and professional reporting on human rights, humanitarian efforts, and current events in Sudan." />
        <meta name="keywords" content="Sudan news, Darfur news, Sudan conflict updates, Sudan current events, human rights news Sudan" />
        <link rel="canonical" href="https://sudan-action-hub.com/news" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Latest News on Sudan | Sudan Action Hub" />
        <meta property="og:description" content="Stay informed with the latest news and professional reporting on human rights, humanitarian efforts, and current events in Sudan." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=630&fit=crop" />
        <meta property="og:url" content="https://sudan-action-hub.com/news" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sudan Action Hub" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest News on Sudan | Sudan Action Hub" />
        <meta name="twitter:description" content="Stay informed with the latest news and professional reporting on human rights, humanitarian efforts, and current events in Sudan." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=1200&h=630&fit=crop" />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Latest News</h1>
            <p className="text-xl text-blue-100">
              Stay informed with professional reporting on Sudan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {(article.image_url || article.featured_image || article.image) && (
                  <img
                    src={article.image_url || article.featured_image || article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content || article.excerpt || ''}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{article.author || article.byline || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(article.published_date || article.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewsPage;