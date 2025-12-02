import react, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import FileUploadWidget from '@/components/FileUploadWidget';
import { createResearch, updateResearch, deleteResearch } from '@/api/AdminApi';
import { Trash2, Save, X } from 'lucide-react';

/**
 * ResearchEditor - Component for creating and editing research items
 * 
 * @param {Object} props
 * @param {Object} props.research - Existing research item to edit (optional)
 * @param {Function} props.onSave - Callback when research is saved
 * @param {Function} props.onCancel - Callback when cancel is clicked
 * @param {Function} props.onDelete - Callback when item is deleted
 */
const ResearchEditor = ({ research = null, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    content: '',
    document_url: '',
    featured_image: '',
    author: '',
    published_date: new Date().toISOString().split('T')[0],
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (research) {
      setFormData({
        title: research.title || '',
        abstract: research.abstract || '',
        content: research.content || '',
        document_url: research.document_url || '',
        featured_image: research.featured_image || '',
        author: research.author || '',
        published_date: research.published_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        tags: Array.isArray(research.tags) ? research.tags.join(', ') : research.tags || '',
        status: research.status || 'draft',
      });
    }
  }, [research]);

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

  const handleDocumentUpload = (url) => {
    handleInputChange('document_url', url);
    toast({
      title: 'Document uploaded',
      description: 'Research document has been set',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const researchData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (research?.id) {
        await updateResearch(research.id, researchData);
        toast({
          title: 'Success',
          description: 'Research item updated',
        });
      } else {
        await createResearch(researchData);
        toast({
          title: 'Success',
          description: 'Research item created',
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
    if (!research?.id || !confirm('Are you sure you want to delete this research item?')) return;

    setLoading(true);
    try {
      await deleteResearch(research.id);
      toast({
        title: 'Deleted',
        description: 'Research item has been deleted',
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
        <CardTitle>{research ? 'Edit Research' : 'Create Research Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Research Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Research title"
              required
            />
          </div>

          {/* Abstract */}
          <div>
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
              placeholder="Research abstract or summary"
              required
              rows="4"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Full research content"
              required
              rows="8"
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label>Featured Image</Label>
            <FileUploadWidget
              onUpload={handleImageUpload}
              bucket="research-images"
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

          {/* Research Document */}
          <div>
            <Label>Research Document (PDF)</Label>
            <FileUploadWidget
              onUpload={handleDocumentUpload}
              bucket="research-documents"
              folder="pdfs"
              acceptedTypes=".pdf,.doc,.docx"
              label="Upload Document"
            />
            {formData.document_url && (
              <a
                href={formData.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:underline text-sm"
              >
                📄 View uploaded document
              </a>
            )}
          </div>

          {/* Author */}
          <div>
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Author name or research team"
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
              {loading ? 'Saving...' : 'Save Research'}
            </Button>

            {research && (
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

export default ResearchEditor;
