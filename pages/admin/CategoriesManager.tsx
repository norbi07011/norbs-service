import React, { useState, useEffect } from 'react';
import { Category, CategoryData } from '../../types';
import { MOCK_CATEGORIES } from '../../data/mockData';
import CategoryModal from '../../src/components/admin/CategoryModal';

const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Filter categories based on search and type
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesType = filterType === 'all' || category.type === filterType;
    return matchesSearch && matchesType && category.isActive;
  });

  // Group categories hierarchically
  const getCategoriesHierarchy = () => {
    const parentCategories = filteredCategories.filter(cat => !cat.parentId);
    return parentCategories.map(parent => ({
      ...parent,
      children: filteredCategories.filter(cat => cat.parentId === parent.id)
    }));
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, isActive: false } : cat
      ));
    }
  };

  const handleSaveCategory = (categoryData: CategoryData) => {
    if (editingCategory) {
      // Update existing
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryData, updatedAt: new Date().toISOString() }
          : cat
      ));
    } else {
      // Create new
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        ...categoryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-blue-600 bg-blue-100';
      case 'product': return 'text-pink-600 bg-pink-100';
      case 'service': return 'text-purple-600 bg-purple-100';
      case 'file': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categoriesHierarchy = getCategoriesHierarchy();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Categories Management</h1>
        <button
          onClick={handleAddCategory}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          title="Filter by category type"
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="all">All Types</option>
          <option value="project">Projects</option>
          <option value="product">Products</option>
          <option value="service">Services</option>
          <option value="file">Files</option>
        </select>
      </div>

      {/* Categories List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categoriesHierarchy.map((category) => (
                <React.Fragment key={category.id}>
                  {/* Parent Category */}
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          data-color={category.color}
                        ></div>
                        <div>
                          <div className="font-medium text-foreground">{category.name}</div>
                          {category.children.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {category.children.length} subcategories
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(category.type)}`}>
                        {category.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-accent hover:text-accent/80 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-destructive hover:text-destructive/80 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Child Categories */}
                  {category.children.map((child) => (
                    <tr key={child.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 ml-6">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300" 
                            data-color={child.color}
                          ></div>
                          <div className="font-medium text-foreground">↳ {child.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(child.type)}`}>
                          {child.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {child.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditCategory(child)}
                            className="text-accent hover:text-accent/80 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(child.id)}
                            className="text-destructive hover:text-destructive/80 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{categories.filter(c => c.isActive).length}</div>
          <div className="text-sm text-muted-foreground">Total Categories</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{categories.filter(c => c.type === 'project' && c.isActive).length}</div>
          <div className="text-sm text-muted-foreground">Projects</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-pink-600">{categories.filter(c => c.type === 'product' && c.isActive).length}</div>
          <div className="text-sm text-muted-foreground">Products</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{categories.filter(c => c.type === 'service' && c.isActive).length}</div>
          <div className="text-sm text-muted-foreground">Services</div>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
        categories={categories}
      />
    </div>
  );
};

export default CategoriesManager;