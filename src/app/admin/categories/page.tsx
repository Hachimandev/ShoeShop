"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryService, Category } from "@/services/category.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryIdInput, setCategoryIdInput] = useState("");
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((c) =>
          c.categoryName.toLowerCase().includes(term)
        )
      );
    }
  }, [search, categories]);

  const handleOpenAddDialog = () => {
    setEditingCategory(null);
    setCategoryIdInput("");
    setCategoryNameInput("");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryIdInput(category.categoryId);
    setCategoryNameInput(category.categoryName);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!categoryNameInput.trim() || !categoryIdInput.trim()) return;
    try {
      setSaving(true);
      const payload: Category = {
        categoryId: categoryIdInput.trim(),
        categoryName: categoryNameInput.trim(),
      };
      
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.categoryId, payload);
      } else {
        await categoryService.createCategory(payload);
      }
      setIsDialogOpen(false);
      loadCategories();
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra khi lưu loại sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa loại sản phẩm này không?")) return;
    try {
      setLoading(true);
      await categoryService.deleteCategory(id);
      loadCategories();
    } catch (e) {
      console.error(e);
      alert("Có lỗi xảy ra khi xóa loại sản phẩm. Vui lòng kiểm tra xem loại sản phẩm này có chứa sản phẩm nào không.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Quản lý loại sản phẩm
          </h1>
          <p className="text-muted-foreground mt-2">
            Thêm, sửa, xóa các danh mục sản phẩm
          </p>
        </div>
        <Button onClick={handleOpenAddDialog} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm loại
        </Button>
      </div>

      <Card className="rounded-xl border border-slate-200/90 bg-white shadow-sm">
        <CardContent className="p-4 md:p-5">
          <div className="relative min-w-0 flex-1 basis-0 max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <Input
              placeholder="Tìm kiếm loại sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 rounded-lg border-slate-200 bg-white pl-10 shadow-sm placeholder:text-slate-400"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Mã loại</th>
                  <th className="px-6 py-4 font-medium">Tên loại</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      Không có loại sản phẩm nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => (
                    <tr key={c.categoryId} className="border-b border-slate-100 hover:bg-slate-50/80">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.categoryId}</td>
                      <td className="px-6 py-4 text-slate-700">{c.categoryName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleOpenEditDialog(c)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(c.categoryId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t bg-slate-50/50 text-sm text-slate-600">
            Tổng cộng: {filteredCategories.length} loại sản phẩm
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Mã loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <Input
                value={categoryIdInput}
                onChange={(e) => setCategoryIdInput(e.target.value)}
                placeholder="Nhập mã loại sản phẩm (VD: CAT01)..."
                className="w-full"
                disabled={!!editingCategory} // Cannot edit ID if updating
                autoFocus={!editingCategory}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Tên loại sản phẩm <span className="text-red-500">*</span>
              </label>
              <Input
                value={categoryNameInput}
                onChange={(e) => setCategoryNameInput(e.target.value)}
                placeholder="Nhập tên loại sản phẩm..."
                className="w-full"
                autoFocus={!!editingCategory}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white" 
              onClick={handleSave} 
              disabled={!categoryNameInput.trim() || !categoryIdInput.trim() || saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
