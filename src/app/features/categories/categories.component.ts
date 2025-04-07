import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { CategoriesApiService, Category } from '../../core/api/categories';
import { CustomDatasource, PageChangeEvent, TableColumn } from '../../shared/components/table/table.assets';
import { PaginationOptions } from '../../shared/models';
import { ModalService, ModalStyle } from '../../shared/services/modal.service';
import { ConfirmModalComponent } from '../../shared/components/modal/confirm-modal/confirm-modal.component';
import { CategoriesModalComponent } from './categories-modal/categories-modal/categories-modal.component';
import { CategoriesModalMode } from './categories-modal/categories-modal/categories-modal.model';

export interface PaginationData {
  page: number;
  limit: number;
}

@Component({
  selector: 'tickets-categories',
  imports: [TableComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  @ViewChild(TableComponent) tableComponent!: TableComponent<Category>;
  modal = inject(ModalService);
  categoriesApiService = inject(CategoriesApiService);
  categoriesColumns = signal<TableColumn[]>([
    {
      name: 'Id',
      dataKey: 'id',
    },
    {
      name: 'Name',
      dataKey: 'name',
    },
    {
      name: 'Description',
      dataKey: 'description',
    },
    {
      name: 'ParentCategoryId',
      dataKey: 'parentCategoryId',
    },
  ]);
  categories = signal<CustomDatasource<Category> | null>(null);
  search = signal<string>('');
  currentPaginationData = signal<PaginationData>({ page: 0, limit: 10 });

  ngOnInit(): void {
    this.loadCategories();
  }

  async onSearchChanged(search: string): Promise<void> {
    this.search.set(search);
    await this.loadCategories({ search, page: 0, limit: 10 });
  }

  async onPageChanged(data: PageChangeEvent) {
    console.log('CHANGED');
    console.log(data);
    const search = this.search();
    const { pageIndex: page, pageSize: limit } = data;

    this.currentPaginationData.set({ page, limit });

    await this.loadCategories({ page, limit, search });
  }

  async onEditClicked(category: Category): Promise<void> {
    const updatedCategory = await this.modal.open(CategoriesModalComponent, {
      data: { category, mode: CategoriesModalMode.EDIT },
    });

    if (!updatedCategory) {
      return;
    }

    const categories = this.categories();
    const newCategories = categories!.data.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat));

    this.categories.set({ data: newCategories, total: categories!.total });
  }

  async onDeleteClicked(category: Category) {
    const wasDeleted = await this.modal.open(ConfirmModalComponent, { style: ModalStyle.ConfirmModal });
    if (!wasDeleted) {
      return;
    }

    const { page, limit } = this.currentPaginationData();
    const search = this.search();

    await this.categoriesApiService.deleteCategory(category.id);

    if (this.categories()!.data.length === 1) {
      console.log(1);
      this.tableComponent.pageChanged.emit({
        pageIndex: Math.max(page - 1, 0),
        pageSize: limit,
      });
    }

    await this.loadCategories({ search, page, limit });
  }

  async onAddClicked() {
    const newCategory = await this.modal.open(CategoriesModalComponent, { data: { mode: CategoriesModalMode.CREATE } });

    if (newCategory) {
      const categories = this.categories();
      const currentPaginationData = this.currentPaginationData();
      const newTotal = categories!.total + 1;

      if (categories!.data.length < currentPaginationData.limit) {
        const newCategories = [...categories!.data, newCategory];
        this.categories.set({ data: newCategories, total: newTotal });
      } else {
        this.categories.set({ data: categories!.data, total: newTotal });
      }
    }
  }

  private async loadCategories(options?: PaginationOptions): Promise<void> {
    const optionsWithSearch: PaginationOptions = options
      ? { ...options, searchFields: ['name', 'description'] }
      : { page: 0, limit: 10 };

    const categories = await this.categoriesApiService.getAllCategories(optionsWithSearch);
    const mappedCategories: CustomDatasource<Category> = {
      data: categories.items,
      total: categories.total,
    };

    this.categories.set(mappedCategories);
  }
}
