"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Newspaper,
  Video,
  IndianRupee,
  FileText,
  TrendingUp,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Shield,
  Calculator,
  Award,
  Loader2,
  RefreshCw,
  Key,
  Settings,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

// Types
interface Update {
  id: string;
  type: "bond" | "news" | "document";
  category: string;
  title: string;
  description: string;
  fullDescription?: string;
  rate?: string;
  minInvestment?: string;
  maxInvestment?: string;
  tenure?: string;
  date: string;
  isNew: boolean;
  features: string[];
  documentUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

interface LearnContent {
  id: string;
  category: string;
  type: "video" | "presentation";
  title: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  downloadUrl?: string;
  duration: string;
  level: string;
  views: string;
  rating: number;
  instructor: string;
  topics: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    {message}
    <button onClick={onClose} className="ml-2 hover:opacity-80">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// Password Change Modal Component
const PasswordChangeModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: (message: string) => void }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cms/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess("Password changed successfully! Use new password on next login.");
        onClose();
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch {
      setError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-bold text-primary">Change Password</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Show passwords</span>
          </label>

          {error && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary hover:bg-primary-light text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              {loading ? "Changing..." : "Change Password"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Login Component
const LoginForm = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onLogin();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-accent-dark" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary">Admin Login</h1>
          <p className="text-muted mt-2">Systematic Investments CMS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent pr-12"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
            {loading ? "Logging in..." : "Login to CMS"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Update Form Component
const UpdateForm = ({
  update,
  onSave,
  onCancel,
  isSaving,
}: {
  update?: Update;
  onSave: (data: Partial<Update>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}) => {
  const [formData, setFormData] = useState<Partial<Update>>(
    update || {
      type: "bond",
      category: "Government Bond",
      title: "",
      description: "",
      fullDescription: "",
      rate: "",
      minInvestment: "",
      maxInvestment: "",
      tenure: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      isNew: true,
      features: [],
      documentUrl: "#",
      imageUrl: "",
    }
  );
  const [featuresText, setFeaturesText] = useState(formData.features?.join(", ") || "");
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(update?.imageUrl || formData.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  // Update preview when formData changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    }
  }, [formData.imageUrl]);

  // Convert file to base64
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, imageUrl: base64String });
        setImagePreview(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert("Failed to read image file");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      alert("Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      features: featuresText.split(",").map((f) => f.trim()).filter(Boolean),
    });
  };

  const categories = {
    bond: ["Government Bond", "Gold Bond", "Infrastructure Bond", "Corporate Bond"],
    news: ["Scheme Launch", "Tax Update", "Market Update", "Policy Change"],
    document: ["Guide", "Report", "Template", "Research"],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Update["type"] })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="bond">Bond/NCD</option>
            <option value="news">News</option>
            <option value="document">Document</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {categories[formData.type || "bond"].map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          rows={2}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (Optional)</label>
        <textarea
          value={formData.fullDescription}
          onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          rows={3}
        />
      </div>

      {formData.type === "bond" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
            <input
              type="text"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="8.05%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Investment</label>
            <input
              type="text"
              value={formData.minInvestment}
              onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="₹1,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Investment</label>
            <input
              type="text"
              value={formData.maxInvestment}
              onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="No Limit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure</label>
            <input
              type="text"
              value={formData.tenure}
              onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="7 years"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="December 2024"
          />
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNew}
              onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-gray-700">Mark as New</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
        
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
          />
          
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex gap-2">
                <label
                  htmlFor="image-upload"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg cursor-pointer transition-colors text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Change Image
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, imageUrl: "" });
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-gray-600">Uploading image...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg cursor-pointer transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* URL Input Alternative */}
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-600 mb-1">Or paste image URL:</label>
          <input
            type="url"
            value={formData.imageUrl && !formData.imageUrl.startsWith("data:") ? formData.imageUrl : ""}
            onChange={handleImageUrlChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
        <input
          type="text"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="Feature 1, Feature 2, Feature 3"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {update ? "Update" : "Create"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Learn Content Form Component
const LearnForm = ({
  content,
  onSave,
  onCancel,
}: {
  content?: LearnContent;
  onSave: (data: Partial<LearnContent>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<LearnContent>>(
    content || {
      category: "basics",
      type: "video",
      title: "",
      description: "",
      thumbnail: "",
      videoUrl: "",
      downloadUrl: "",
      duration: "",
      level: "Beginner",
      views: "0",
      rating: 4.5,
      instructor: "Systematic Investments",
      topics: [],
      isFeatured: false,
      isActive: true,
    }
  );
  const [topicsText, setTopicsText] = useState(formData.topics?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      topics: topicsText.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "video" | "presentation" })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="video">Video</option>
            <option value="presentation">Presentation</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="basics">Basics</option>
            <option value="investing">Investing</option>
            <option value="mfd">For MFDs</option>
            <option value="retirement">Retirement</option>
            <option value="tax">Tax Planning</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
        <input
          type="url"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">For YouTube: https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg</p>
      </div>

      {formData.type === "video" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Embed URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Download URL</label>
          <input
            type="url"
            value={formData.downloadUrl}
            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="https://drive.google.com/..."
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="18 min"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
          <input
            type="text"
            value={formData.views}
            onChange={(e) => setFormData({ ...formData, views: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
            placeholder="1.2M"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
        <input
          type="text"
          value={formData.instructor}
          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="CA Rachana Ranade"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Topics (comma-separated)</label>
        <input
          type="text"
          value={topicsText}
          onChange={(e) => setTopicsText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20"
          placeholder="Topic 1, Topic 2, Topic 3"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          className="flex-1 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {content ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Main Admin Component
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"updates" | "learn">("updates");
  const [updates, setUpdates] = useState<Update[]>([]);
  const [learnContent, setLearnContent] = useState<LearnContent[]>([]);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [editingLearn, setEditingLearn] = useState<LearnContent | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showLearnForm, setShowLearnForm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isSavingUpdate, setIsSavingUpdate] = useState(false);

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/cms/auth");
      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    if (isAuthenticated) {
      loadUpdates();
      loadLearnContent();
    }
  }, [isAuthenticated]);

  const loadUpdates = async () => {
    try {
      const res = await fetch("/api/cms/updates");
      const data = await res.json();
      setUpdates(data);
    } catch {
      showToast("Failed to load updates", "error");
    }
  };

  const loadLearnContent = async () => {
    try {
      const res = await fetch("/api/cms/learn");
      const data = await res.json();
      setLearnContent(data.content || []);
    } catch {
      showToast("Failed to load content", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/cms/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  // Update CRUD
  const handleSaveUpdate = async (data: Partial<Update>) => {
    if (isSavingUpdate) return; // Prevent double submission
    
    setIsSavingUpdate(true);
    try {
      const method = editingUpdate ? "PUT" : "POST";
      const body = editingUpdate ? { ...data, id: editingUpdate.id } : data;

      const res = await fetch("/api/cms/updates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(editingUpdate ? "Update saved!" : "Update created!", "success");
        loadUpdates();
        setShowUpdateForm(false);
        setEditingUpdate(null);
      } else {
        showToast("Failed to save", "error");
      }
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setIsSavingUpdate(false);
    }
  };

  const handleDeleteUpdate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    try {
      const res = await fetch(`/api/cms/updates?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Update deleted!", "success");
        loadUpdates();
      }
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  // Learn CRUD
  const handleSaveLearn = async (data: Partial<LearnContent>) => {
    try {
      const method = editingLearn ? "PUT" : "POST";
      const body = editingLearn ? { ...data, id: editingLearn.id } : data;

      const res = await fetch("/api/cms/learn", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        showToast(editingLearn ? "Content saved!" : "Content created!", "success");
        loadLearnContent();
        setShowLearnForm(false);
        setEditingLearn(null);
      }
    } catch {
      showToast("Failed to save", "error");
    }
  };

  const handleDeleteLearn = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      const res = await fetch(`/api/cms/learn?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Content deleted!", "success");
        loadLearnContent();
      }
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bond": return <IndianRupee className="w-4 h-4" />;
      case "news": return <Newspaper className="w-4 h-4" />;
      case "document": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "presentation": return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basics": return <GraduationCap className="w-4 h-4" />;
      case "investing": return <TrendingUp className="w-4 h-4" />;
      case "mfd": return <Award className="w-4 h-4" />;
      case "retirement": return <Shield className="w-4 h-4" />;
      case "tax": return <Calculator className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordChangeModal
            onClose={() => setShowPasswordModal(false)}
            onSuccess={(message) => showToast(message, "success")}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">SI</span>
              </div>
              <div>
                <h1 className="font-heading font-bold text-primary">CMS Admin</h1>
                <p className="text-xs text-muted">Systematic Investments</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Change Password"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("updates")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "updates"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Updates ({updates.length})
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "learn"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Video className="w-4 h-4" />
              Learn ({learnContent.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Updates Tab */}
        {activeTab === "updates" && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-primary">Manage Updates</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadUpdates}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setEditingUpdate(null); setShowUpdateForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Update
                </button>
              </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
              {showUpdateForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => { setShowUpdateForm(false); setEditingUpdate(null); }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-heading font-bold text-primary mb-4">
                      {editingUpdate ? "Edit Update" : "New Update"}
                    </h3>
                    <UpdateForm
                      update={editingUpdate || undefined}
                      onSave={handleSaveUpdate}
                      onCancel={() => { setShowUpdateForm(false); setEditingUpdate(null); }}
                      isSaving={isSavingUpdate}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {updates.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No updates yet. Create your first update!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {updates.map((update) => (
                    <div key={update.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        update.type === "bond" ? "bg-amber-50 text-amber-600" :
                        update.type === "news" ? "bg-blue-50 text-blue-600" :
                        "bg-purple-50 text-purple-600"
                      }`}>
                        {getTypeIcon(update.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            update.type === "bond" ? "bg-amber-100 text-amber-700" :
                            update.type === "news" ? "bg-blue-100 text-blue-700" :
                            "bg-purple-100 text-purple-700"
                          }`}>
                            {update.category}
                          </span>
                          {update.isNew && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">NEW</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 truncate">{update.title}</h4>
                        <p className="text-sm text-gray-500 truncate">{update.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">{update.date}</span>
                        <button
                          onClick={() => { setEditingUpdate(update); setShowUpdateForm(true); }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUpdate(update.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === "learn" && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-primary">Manage Learning Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadLearnContent}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setEditingLearn(null); setShowLearnForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Content
                </button>
              </div>
            </div>

            {/* Form Modal */}
            <AnimatePresence>
              {showLearnForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => { setShowLearnForm(false); setEditingLearn(null); }}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-heading font-bold text-primary mb-4">
                      {editingLearn ? "Edit Content" : "New Content"}
                    </h3>
                    <LearnForm
                      content={editingLearn || undefined}
                      onSave={handleSaveLearn}
                      onCancel={() => { setShowLearnForm(false); setEditingLearn(null); }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {learnContent.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No content yet. Add your first video or presentation!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {learnContent.map((content) => (
                    <div key={content.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {content.thumbnail ? (
                          <img src={content.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                            {getTypeIcon(content.type)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
                            {getCategoryIcon(content.category)}
                            {content.category}
                          </span>
                          {content.isFeatured && (
                            <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent-dark rounded-full">Featured</span>
                          )}
                          {!content.isActive && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Hidden</span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                        <p className="text-sm text-gray-500">{content.instructor} • {content.duration} • {content.views} views</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => { setEditingLearn(content); setShowLearnForm(true); }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLearn(content.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

