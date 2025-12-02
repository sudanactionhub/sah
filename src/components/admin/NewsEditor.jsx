import react, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import FileUploadWidget from '@/components/FileUploadWidget';
import { createNews, updateNews, deleteNews } from '@/api/AdminApi';
import { Trash2, Save, X } from 'lucide-react';

/**
 * NewsEditor - Component for creating and editing news articles
 * 
 * @param {Object} props
 * @param {Object} props.news - Existing news item to edit (optional)
 * @param {Function} props.onSave - Callback when news is saved
 * @param {Function} props.onCancel - Callback when cancel is clicked
 * @param {Function} props.onDelete - Callback when item is deleted
 */
const NewsEditor = ({ news = null, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    author: '',
    published_date: new Date().toISOString().split('T')[0],
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        excerpt: news.excerpt || '',
        content: news.content || '',
        featured_image: news.featured_image || '',
        author: news.author || '',
        published_date: news.published_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        tags: Array.isArray(news.tags) ? news.tags.join(', ') : news.tags || '',
        status: news.status || 'draft',
      });
    }
  }, [news]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (url) => {
    handleInputChange('featured_image', url);
    toast({
      title: 'Image uploaded',
      description: 'Featured image has been set',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newsData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (news?.id) {
        await updateNews(news.id, newsData);
        toast({
          title: 'Success',
          description: 'News article updated',
        });
      } else {
        await createNews(newsData);
        toast({
          title: 'Success',
          description: 'News article created',
        });
      }

      if (onSave) {
        onSave();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!news?.id || !confirm('Are you sure you want to delete this article?')) return;

    setLoading(true);
    try {
      await deleteNews(news.id);
      toast({
        title: 'Deleted',
        description: 'News article has been deleted',
      });
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{news ? 'Edit News Article' : 'Create News Article'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="News article title"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              placeholder="Brief summary of the article"
              required
              rows="2"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Full article content"
              required
              rows="8"
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label>Featured Image</Label>
            <FileUploadWidget
              onUpload={handleImageUpload}
              bucket="news-images"
              folder="featured"
              acceptedTypes="image/*"
              label="Upload Image"
            />
            {formData.featured_image && (
              <img
                src={formData.featured_image}
                alt="Featured"
                className="mt-2 h-32 w-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Author name"
            />
          </div>

          {/* Published Date */}
          <div>
            <Label htmlFor="published_date">Published Date</Label>
            <Input
              id="published_date"
              type="date"
              value={formData.published_date}
              onChange={(e) => handleInputChange('published_date', e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Separate tags with commas"
            />
            {formData.tags && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {formData.tags.split(',').map(tag => (
                  <Badge key={tag} variant="secondary">{tag.trim()}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Article'}
            </Button>

            {news && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsEditor;
