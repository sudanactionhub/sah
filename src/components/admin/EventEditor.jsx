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
  const EVENT_CATEGORIES = [
    'Press Interviews',
    'Protests',
    'Fundraisers',
    'Workshops & Teach-Ins',
    'General Advocacy',
  ];

  const [availableCategories, setAvailableCategories] = useState(EVENT_CATEGORIES);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    // 'address' -> full address line, 'location' -> City, State (maps to events.location column)
    address: '',
    location: '',
    registration_url: '',
    featured_image: '',
    organizer: '',
    tags: [],
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
        address: event.address || '',
        location: event.location || '',
        registration_url: event.registration_url || '',
        featured_image: event.featured_image || '',
        organizer: event.organizer || '',
        tags: Array.isArray(event.tags) ? event.tags : (event.tags ? [event.tags] : []),
        status: event.status || 'draft',
      });

      // Merge any unknown tags into available categories so they can be re-used
      if (Array.isArray(event.tags)) {
        const unknown = event.tags.filter(t => !availableCategories.includes(t));
        if (unknown.length) setAvailableCategories(prev => Array.from(new Set([...prev, ...unknown])));
      }
    }
  }, [event, availableCategories]);

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
        // Ensure tags is an array of trimmed strings
        tags: Array.isArray(formData.tags) ? formData.tags.map(t => t.trim()).filter(Boolean) : [],
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

          {/* Description (optional) */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Event description (optional)"
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

          {/* Address line and City/State (location) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address Line</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Street address, building, etc."
              />
            </div>
            <div>
              <Label htmlFor="location">City, State</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, State (e.g., Khartoum, Khartoum)"
              />
            </div>
          </div>

          {/* Registration / external link */}
          <div>
            <Label htmlFor="registration_url">Registration / External Link</Label>
            <Input
              id="registration_url"
              type="url"
              value={formData.registration_url}
              onChange={(e) => handleInputChange('registration_url', e.target.value)}
              placeholder="https://... or /internal-path"
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

          {/* Tags (select existing or add new) */}
          <div>
            <Label>Tags</Label>
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-2">
                {availableCategories.map(cat => {
                  const checked = formData.tags.includes(cat);
                  return (
                    <label key={cat} className="inline-flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            tags: prev.tags.includes(cat) ? prev.tags.filter(t => t !== cat) : [...prev.tags, cat],
                          }));
                        }}
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  );
                })}
              </div>

              {formData.tags.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input id="new-tag" placeholder="Add new tag" onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.target.value.trim();
                    if (!val) return;
                    if (!availableCategories.includes(val)) setAvailableCategories(prev => [...prev, val]);
                    if (!formData.tags.includes(val)) setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
                    e.target.value = '';
                  }
                }} />
                <Button type="button" onClick={() => {
                  const input = document.getElementById('new-tag');
                  const val = input?.value?.trim();
                  if (!val) return;
                  if (!availableCategories.includes(val)) setAvailableCategories(prev => [...prev, val]);
                  if (!formData.tags.includes(val)) setFormData(prev => ({ ...prev, tags: [...prev.tags, val] }));
                  if (input) input.value = '';
                }}>Add</Button>
              </div>
            </div>
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
