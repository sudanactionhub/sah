import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as AdminApi from '@/api/AdminApi';

/**
 * useAdminContent - Custom hook for managing admin content operations
 * Handles loading, error states, and common operations
 * 
 * @param {string} contentType - Type of content ('news', 'events', 'research')
 * @returns {Object} Content state and methods
 */
export const useAdminContent = (contentType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const getApiFunction = (operation) => {
    const typeMap = {
      news: {
        get: AdminApi.getNews,
        create: AdminApi.createNews,
        update: AdminApi.updateNews,
        delete: AdminApi.deleteNews,
      },
      events: {
        get: AdminApi.getEvents,
        create: AdminApi.createEvent,
        update: AdminApi.updateEvent,
        delete: AdminApi.deleteEvent,
      },
      research: {
        get: AdminApi.getResearch,
        create: AdminApi.createResearch,
        update: AdminApi.updateResearch,
        delete: AdminApi.deleteResearch,
      },
    };

    return typeMap[contentType]?.[operation];
  };

  const fetchContent = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const getFn = getApiFunction('get');
      const result = await getFn(filters);
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contentType, toast]);

  const createContent = useCallback(async (contentData) => {
    try {
      setLoading(true);
      const createFn = getApiFunction('create');
      const result = await createFn(contentData);
      toast({
        title: 'Success',
        description: `${contentType} item created`,
      });
      await fetchContent();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to create content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contentType, toast, fetchContent]);

  const updateContent = useCallback(async (id, contentData) => {
    try {
      setLoading(true);
      const updateFn = getApiFunction('update');
      const result = await updateFn(id, contentData);
      toast({
        title: 'Success',
        description: `${contentType} item updated`,
      });
      await fetchContent();
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contentType, toast, fetchContent]);

  const deleteContent = useCallback(async (id) => {
    try {
      setLoading(true);
      const deleteFn = getApiFunction('delete');
      await deleteFn(id);
      toast({
        title: 'Success',
        description: `${contentType} item deleted`,
      });
      await fetchContent();
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contentType, toast, fetchContent]);

  return {
    data,
    loading,
    error,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
  };
};

/**
 * useFileUpload - Custom hook for file upload operations
 * Handles file validation and upload to Supabase Storage
 * 
 * @returns {Object} Upload methods and state
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file, bucket, folder = '') => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file
      if (!file) {
        throw new Error('No file provided');
      }

      setUploadProgress(50);

      // Upload file
      const { url, path } = await AdminApi.uploadFile(file, bucket, folder);

      setUploadProgress(100);
      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });

      return { url, path };
    } catch (err) {
      const errorMsg = err.message || 'Upload failed';
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMsg,
      });
      throw err;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [toast]);

  const deleteFile = useCallback(async (filePath, bucket) => {
    try {
      setUploading(true);
      await AdminApi.deleteFile(filePath, bucket);
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch (err) {
      const errorMsg = err.message || 'Delete failed';
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: errorMsg,
      });
      throw err;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  return {
    uploadFile,
    deleteFile,
    uploading,
    uploadProgress,
  };
};

/**
 * usePageContent - Custom hook for managing page content
 * 
 * @param {string} pageName - Name of the page
 * @returns {Object} Page content state and methods
 */
export const usePageContent = (pageName) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const result = await AdminApi.getPageContent(pageName);
      setContent(result);
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch page content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pageName, toast]);

  const updateContent = useCallback(async (newContent) => {
    try {
      setLoading(true);
      const result = await AdminApi.updatePageContent(pageName, newContent);
      setContent(result);
      toast({
        title: 'Success',
        description: 'Page content updated',
      });
      return result;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update content';
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMsg,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pageName, toast]);

  return {
    content,
    loading,
    error,
    fetchContent,
    updateContent,
  };
};

export default {
  useAdminContent,
  useFileUpload,
  usePageContent,
};
