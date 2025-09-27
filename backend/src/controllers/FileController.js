import { File } from '../models/File.js';
import { Activity } from '../models/Activity.js';
import { validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = join(__dirname, '../../uploads');
    
    try {
      await fs.access(uploadDir);
    } catch (error) {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-zip-compressed',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

export class FileController {
  static upload = upload;

  static async uploadFile(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Clean up uploaded file if validation fails
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded'
        });
      }

      const { projectId, description, category = 'general', isPublic = false } = req.body;

      // Create file record
      const fileData = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        mimeType: req.file.mimetype,
        size: req.file.size,
        projectId: projectId || null,
        uploadedBy: req.user.id,
        description,
        category,
        isPublic: isPublic === 'true' || isPublic === true
      };

      const file = await File.create(fileData);

      // Log activity
      await Activity.logFileUploaded(req.user.id, req.user.name, file.original_name, projectId);

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: file.id,
          originalName: file.original_name,
          fileName: file.file_name,
          mimeType: file.mime_type,
          size: file.size,
          category: file.category,
          isPublic: file.is_public,
          description: file.description,
          createdAt: file.created_at
        }
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      console.error('File upload error:', error);
      res.status(400).json({
        error: error.message || 'Failed to upload file'
      });
    }
  }

  static async getFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          error: 'File not found'
        });
      }

      // Check access permissions
      const hasAccess = await File.isFileAccessible(id, req.user.id, req.user.role);
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Access denied to this file'
        });
      }

      res.json({ file });
    } catch (error) {
      console.error('Get file error:', error);
      res.status(500).json({
        error: 'Failed to fetch file'
      });
    }
  }

  static async downloadFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          error: 'File not found'
        });
      }

      // Check access permissions
      const hasAccess = await File.isFileAccessible(id, req.user.id, req.user.role);
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Access denied to this file'
        });
      }

      // Check if file exists on disk
      try {
        await fs.access(file.file_path);
      } catch (error) {
        return res.status(404).json({
          error: 'File not found on disk'
        });
      }

      // Set download headers
      res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
      res.setHeader('Content-Type', file.mime_type);
      
      // Send file
      res.download(file.file_path, file.original_name);

      // Log download activity
      await Activity.logActivity(req.user.id, req.user.name, `downloaded file "${file.original_name}"`, {
        file_id: file.id,
        file_name: file.original_name
      });
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({
        error: 'Failed to download file'
      });
    }
  }

  static async getProjectFiles(req, res) {
    try {
      const { projectId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const files = await File.getByProject(projectId, parseInt(limit), parseInt(offset));

      res.json({
        files,
        total: files.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get project files error:', error);
      res.status(500).json({
        error: 'Failed to fetch project files'
      });
    }
  }

  static async getUserFiles(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      // Users can only access their own files unless they are owner
      if (req.user.role !== 'owner' && req.user.id !== userId) {
        return res.status(403).json({
          error: 'Access denied to user files'
        });
      }

      const files = await File.getByUser(userId, parseInt(limit), parseInt(offset));

      res.json({
        files,
        total: files.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get user files error:', error);
      res.status(500).json({
        error: 'Failed to fetch user files'
      });
    }
  }

  static async getPublicFiles(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const files = await File.getPublicFiles(parseInt(limit), parseInt(offset));

      res.json({
        files,
        total: files.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get public files error:', error);
      res.status(500).json({
        error: 'Failed to fetch public files'
      });
    }
  }

  static async updateFile(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          error: 'File not found'
        });
      }

      // Check permissions - only owner or file uploader can update
      if (req.user.role !== 'owner' && file.uploaded_by !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied to update this file'
        });
      }

      const updatedFile = await File.update(id, req.body);

      res.json({
        message: 'File updated successfully',
        file: updatedFile
      });
    } catch (error) {
      console.error('Update file error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update file'
      });
    }
  }

  static async deleteFile(req, res) {
    try {
      const { id } = req.params;
      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          error: 'File not found'
        });
      }

      // Check permissions - only owner or file uploader can delete
      if (req.user.role !== 'owner' && file.uploaded_by !== req.user.id) {
        return res.status(403).json({
          error: 'Access denied to delete this file'
        });
      }

      // Soft delete from database
      await File.softDelete(id);

      // Log activity
      await Activity.logActivity(req.user.id, req.user.name, `deleted file "${file.original_name}"`, {
        file_id: file.id,
        file_name: file.original_name
      });

      res.json({
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        error: 'Failed to delete file'
      });
    }
  }

  static async searchFiles(req, res) {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { q: searchTerm, projectId, category, limit = 50, offset = 0 } = req.query;

      const files = await File.searchFiles(
        searchTerm,
        projectId,
        category,
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        files,
        total: files.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        searchTerm
      });
    } catch (error) {
      console.error('Search files error:', error);
      res.status(500).json({
        error: 'Failed to search files'
      });
    }
  }

  static async getStorageStats(req, res) {
    try {
      const stats = await File.getStorageStats();
      const fileTypes = await File.getFilesByType();

      res.json({
        stats,
        fileTypes
      });
    } catch (error) {
      console.error('Get storage stats error:', error);
      res.status(500).json({
        error: 'Failed to fetch storage statistics'
      });
    }
  }
}