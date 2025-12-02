import { supabase } from '@/lib/customSupabaseClient';

/**
 * Admin API - Handles all admin portal operations including content management and file uploads
 */

// ============= FILE UPLOAD OPERATIONS =============

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - Storage bucket name (e.g., 'news-images', 'documents')
 * @param {string} folder - Folder path within bucket (e.g., 'news', 'events')
 * @returns {Promise<{path: string, url: string}>} File path and public URL
 */
export async function uploadFile(file, bucket, folder = '') {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: publicData.publicUrl,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - Full path to the file in storage
 * @param {string} bucket - Storage bucket name
 */
export async function deleteFile(filePath, bucket) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('File deletion error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

// ============= NEWS MANAGEMENT =============

/**
 * Create a new news article
 * @param {Object} newsData - News article data
 * @returns {Promise<Object>} Created news record
 */
export async function createNews(newsData) {
  try {
    const { data, error } = await supabase
      .from('news')
      .insert([{
        title: newsData.title,
        content: newsData.content,
        excerpt: newsData.excerpt,
        featured_image: newsData.featured_image,
        author: newsData.author,
        published_date: newsData.published_date,
        tags: newsData.tags,
        status: newsData.status || 'draft',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create news error:', error);
    throw error;
  }
}

/**
 * Update an existing news article
 * @param {string} id - News article ID
 * @param {Object} newsData - Updated news data
 * @returns {Promise<Object>} Updated news record
 */
export async function updateNews(id, newsData) {
  try {
    const { data, error } = await supabase
      .from('news')
      .update({
        ...newsData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update news error:', error);
    throw error;
  }
}

/**
 * Delete a news article
 * @param {string} id - News article ID
 */
export async function deleteNews(id) {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Delete news error:', error);
    throw error;
  }
}

/**
 * Get all news articles with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of news articles
 */
export async function getNews(filters = {}) {
  try {
    let query = supabase
      .from('news')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get news error:', error);
    throw error;
  }
}

// ============= EVENTS MANAGEMENT =============

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event record
 */
export async function createEvent(eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title: eventData.title,
        description: eventData.description,
        event_date: eventData.event_date,
        event_time: eventData.event_time,
        location: eventData.location,
        featured_image: eventData.featured_image,
        organizer: eventData.organizer,
        tags: eventData.tags,
        status: eventData.status || 'draft',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
}

/**
 * Update an existing event
 * @param {string} id - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event record
 */
export async function updateEvent(id, eventData) {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...eventData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update event error:', error);
    throw error;
  }
}

/**
 * Delete an event
 * @param {string} id - Event ID
 */
export async function deleteEvent(id) {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Delete event error:', error);
    throw error;
  }
}

/**
 * Get all events with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of events
 */
export async function getEvents(filters = {}) {
  try {
    let query = supabase
      .from('events')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get events error:', error);
    throw error;
  }
}

// ============= RESEARCH MANAGEMENT =============

/**
 * Create a new research item
 * @param {Object} researchData - Research data
 * @returns {Promise<Object>} Created research record
 */
export async function createResearch(researchData) {
  try {
    const { data, error } = await supabase
      .from('research')
      .insert([{
        title: researchData.title,
        abstract: researchData.abstract,
        content: researchData.content,
        document_url: researchData.document_url,
        featured_image: researchData.featured_image,
        author: researchData.author,
        published_date: researchData.published_date,
        tags: researchData.tags,
        status: researchData.status || 'draft',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create research error:', error);
    throw error;
  }
}

/**
 * Update an existing research item
 * @param {string} id - Research ID
 * @param {Object} researchData - Updated research data
 * @returns {Promise<Object>} Updated research record
 */
export async function updateResearch(id, researchData) {
  try {
    const { data, error } = await supabase
      .from('research')
      .update({
        ...researchData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update research error:', error);
    throw error;
  }
}

/**
 * Delete a research item
 * @param {string} id - Research ID
 */
export async function deleteResearch(id) {
  try {
    const { error } = await supabase
      .from('research')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Delete research error:', error);
    throw error;
  }
}

/**
 * Get all research items with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Array of research items
 */
export async function getResearch(filters = {}) {
  try {
    let query = supabase
      .from('research')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,abstract.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('published_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get research error:', error);
    throw error;
  }
}

// ============= PAGE CONTENT MANAGEMENT =============

/**
 * Update page content (for hero images, call-to-action, etc.)
 * @param {string} pageName - Page identifier (e.g., 'home', 'about')
 * @param {Object} content - Page content data
 * @returns {Promise<Object>} Updated page content
 */
export async function updatePageContent(pageName, content) {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .upsert({
        page_name: pageName,
        content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'page_name',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update page content error:', error);
    throw error;
  }
}

/**
 * Get page content
 * @param {string} pageName - Page identifier
 * @returns {Promise<Object>} Page content
 */
export async function getPageContent(pageName) {
  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_name', pageName)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || {};
  } catch (error) {
    console.error('Get page content error:', error);
    throw error;
  }
}

// ============= NAVIGATION & SETTINGS =============

/**
 * Update navigation menu
 * @param {Array} menuItems - Array of menu item objects
 * @returns {Promise<Object>} Updated menu
 */
export async function updateNavigation(menuItems) {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({
        setting_key: 'navigation_menu',
        setting_value: menuItems,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'setting_key',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update navigation error:', error);
    throw error;
  }
}

/**
 * Get navigation menu
 * @returns {Promise<Array>} Menu items
 */
export async function getNavigation() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', 'navigation_menu')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.setting_value || [];
  } catch (error) {
    console.error('Get navigation error:', error);
    throw error;
  }
}

// ============= BULK OPERATIONS =============

/**
 * Publish multiple items at once
 * @param {string} contentType - Type of content ('news', 'events', 'research')
 * @param {Array<string>} ids - Array of content IDs to publish
 * @returns {Promise<void>}
 */
export async function publishMultiple(contentType, ids) {
  try {
    const { error } = await supabase
      .from(contentType)
      .update({ status: 'published' })
      .in('id', ids);

    if (error) throw error;
  } catch (error) {
    console.error(`Publish multiple ${contentType} error:`, error);
    throw error;
  }
}

/**
 * Delete multiple items at once
 * @param {string} contentType - Type of content ('news', 'events', 'research')
 * @param {Array<string>} ids - Array of content IDs to delete
 * @returns {Promise<void>}
 */
export async function deleteMultiple(contentType, ids) {
  try {
    const { error } = await supabase
      .from(contentType)
      .delete()
      .in('id', ids);

    if (error) throw error;
  } catch (error) {
    console.error(`Delete multiple ${contentType} error:`, error);
    throw error;
  }
}
