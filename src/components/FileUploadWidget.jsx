import react, { useState, useCallback } from 'react';
import { Upload, X, FileIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { uploadFile } from '@/api/AdminApi';

/**
 * FileUploadWidget - Reusable file upload component
 * Supports image and document uploads to Supabase Storage
 * 
 * @param {Object} props
 * @param {Function} props.onUpload - Callback when file is successfully uploaded: (url, filePath) => void
 * @param {string} props.bucket - Supabase storage bucket name
 * @param {string} props.folder - Folder path within bucket
 * @param {string} props.acceptedTypes - Comma-separated file types (default: all files)
 * @param {boolean} props.multiple - Allow multiple files
 * @param {string} props.maxSize - Max file size in MB (default: 10)
 * @param {string} props.label - Label for the upload button
 */
const FileUploadWidget = ({
  onUpload,
  bucket,
  folder = '',
  acceptedTypes = '*',
  multiple = false,
  maxSize = 10,
  label = 'Upload File',
  showPreview = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { toast } = useToast();

  const isImage = (file) => file.type.startsWith('image/');
  const isDocument = (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);

  const handleFileSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);

    if (!multiple && files.length > 1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Only one file allowed',
      });
      return;
    }

    for (const file of files) {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `Maximum file size is ${maxSize}MB`,
        });
        continue;
      }

      // Upload file
      try {
        setUploading(true);
        const { url, path } = await uploadFile(file, bucket, folder);

        const fileInfo = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          path,
        };

        setUploadedFiles(prev => multiple ? [...prev, fileInfo] : [fileInfo]);
        
        // Call onUpload callback
        if (onUpload) {
          onUpload(url, path);
        }

        toast({
          title: 'Success',
          description: `${file.name} uploaded successfully`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: error.message,
        });
      } finally {
        setUploading(false);
      }
    }

    // Reset file input
    event.target.value = '';
  }, [bucket, folder, maxSize, multiple, onUpload, toast]);

  const handleRemoveFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (file) => {
    if (isImage(file)) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (isDocument(file)) {
      return <FileIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="flex items-center gap-2"
            asChild
          >
            <span>
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? 'Uploading...' : label}
            </span>
          </Button>
          <input
            type="file"
            multiple={multiple}
            accept={acceptedTypes}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Preview uploaded files */}
      {showPreview && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              {/* Show preview for images */}
              {isImage(file) && (
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-12 w-12 object-cover rounded ml-2"
                />
              )}

              <button
                onClick={() => handleRemoveFile(file.id)}
                className="ml-2 p-1 hover:bg-gray-200 rounded"
                title="Remove file"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadWidget;
