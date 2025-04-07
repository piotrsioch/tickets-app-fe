import { Component, inject, OnInit } from '@angular/core';
import { CategoriesModalData, CategoriesModalMode } from './categories-modal.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalHeaderComponent } from '../../../shared/components/modal/modal-header/modal-header.component';
import { ModalButtonsComponent } from '../../../shared/components/modal/modal-buttons/modal-buttons.component';
import { CategoriesApiService, Category, CreateCategory } from '../../../core/api/categories';
import { ToastService } from '../../../core/services/toast.service';
import { ToastSeverity } from '../../../core/services/types/toast.model';

@Component({
  selector: 'tickets-categories-modal',
  imports: [ReactiveFormsModule, ModalHeaderComponent, ModalButtonsComponent],
  templateUrl: './categories-modal.component.html',
  styleUrl: './categories-modal.component.scss',
})
export class CategoriesModalComponent implements OnInit {
  categoriesApiService = inject(CategoriesApiService);
  toastService = inject(ToastService);
  dialogRef = inject(MatDialogRef);
  data: CategoriesModalData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    name: ['', { nonNullable: true }],
    description: ['', { nonNullable: true }],
    parentCategoryId: [undefined as number | undefined],
  });

  ngOnInit() {
    this.form.patchValue({
      name: this.data?.category?.name,
      description: this.data?.category?.description,
      parentCategoryId: this.data?.category?.parentCategoryId,
    });
  }

  async onSave(wasSaveClicked: boolean) {
    if (!wasSaveClicked) {
      this.close();
    }

    const { name, description, parentCategoryId } = this.form.value as Partial<Category>;

    if (!name || !description) {
      this.toastService.show('Name and description are required', ToastSeverity.ERROR);
      return;
    }

    const isFormDataDifferent = this.isFormDataDifferentFromPassedValue();

    if (isFormDataDifferent) {
      this.data.mode === 'create'
        ? await this.createCategory({ name, description, parentCategoryId })
        : await this.updateCategory(this.data.category!.id, { name, description, parentCategoryId });
    }
  }

  close() {
    this.dialogRef.close();
  }

  private isFormDataDifferentFromPassedValue() {
    const formValue = this.form.value;
    const original = this.data?.category;

    if (!original) return true;

    return (
      formValue.name !== original.name ||
      formValue.description !== original.description ||
      formValue.parentCategoryId !== original.parentCategoryId
    );
  }

  private async createCategory(course: CreateCategory): Promise<void> {
    try {
      const newCategory = await this.categoriesApiService.createCategory({ ...course });
      this.toastService.show('Category created', ToastSeverity.SUCCESS);
      this.dialogRef.close(newCategory);
    } catch (error) {
      console.error(error);
      this.toastService.show('Error creating category', ToastSeverity.ERROR);
    }
  }

  private async updateCategory(id: number, course: Partial<Category>) {
    try {
      const updatedCategory = await this.categoriesApiService.updateCategory(id, course);
      this.toastService.show('Category updated', ToastSeverity.SUCCESS);
      this.dialogRef.close(updatedCategory);
    } catch (error) {
      console.error(error);
      this.toastService.show('Error updating category', ToastSeverity.ERROR);
    }
  }

  protected readonly CategoriesModalMode = CategoriesModalMode;
}
