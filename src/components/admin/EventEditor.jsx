import react, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import FileUploadWidget from '@/components/FileUploadWidget';
import { createEvent, updateEvent, deleteEvent } from '@/api/AdminApi';
import { Trash2, Save, X } from 'lucide-react';

/**
 * EventEditor - Component for creating and editing events
 * 
 * @param {Object} props
 * @param {Object} props.event - Existing event to edit (optional)
 * @param {Function} props.onSave - Callback when event is saved
 * @param {Function} props.onCancel - Callback when cancel is clicked
 * @param {Function} props.onDelete - Callback when item is deleted
 */
const EventEditor = ({ event = null, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    featured_image: '',
    organizer: '',
    tags: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date?.split('T')[0] || '',
        event_time: event.event_time || '',
        location: event.location || '',
        featured_image: event.featured_image || '',
        organizer: event.organizer || '',
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : event.tags || '',
        status: event.status || 'draft',
      });
    }
  }, [event]);

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
      const eventData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      if (event?.id) {
        await updateEvent(event.id, eventData);
        toast({
          title: 'Success',
          description: 'Event updated',
        });
      } else {
        await createEvent(eventData);
        toast({
          title: 'Success',
          description: 'Event created',
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
    if (!event?.id || !confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      await deleteEvent(event.id);
      toast({
        title: 'Deleted',
        description: 'Event has been deleted',
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
        <CardTitle>{event ? 'Edit Event' : 'Create Event'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Event description"
              required
              rows="6"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date">Event Date *</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="event_time">Event Time</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => handleInputChange('event_time', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Event location (venue or address)"
            />
          </div>

          {/* Featured Image */}
          <div>
            <Label>Featured Image</Label>
            <FileUploadWidget
              onUpload={handleImageUpload}
              bucket="events-images"
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

          {/* Organizer */}
          <div>
            <Label htmlFor="organizer">Organizer</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={(e) => handleInputChange('organizer', e.target.value)}
              placeholder="Organization or person organizing the event"
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
              {loading ? 'Saving...' : 'Save Event'}
            </Button>

            {event && (
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

export default EventEditor;
