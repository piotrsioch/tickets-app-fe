import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { CategoriesApiService, Category } from '../../core/api/categories';
import { CustomDatasource, PageChangeEvent, TableColumn } from '../../shared/components/table/table.assets';
import { PaginationOptions } from '../../shared/models';
import { ModalService, ModalStyle } from '../../shared/services/modal.service';
import { ConfirmModalComponent } from '../../shared/components/modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'tickets-categories',
  imports: [TableComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
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

  ngOnInit(): void {
    this.loadCategories();
  }

  async onSearchChanged(search: string): Promise<void> {
    this.search.set(search);
    await this.loadCategories({ search, page: 0, limit: 10 });

    console.log(this.categories());
  }

  async onPageChanged(data: PageChangeEvent) {
    const search = this.search();
    const { pageIndex: page, pageSize: limit } = data;

    await this.loadCategories({ page, limit, search });
  }

  async onEditClicked(category: Category): Promise<void> {
    console.log('Edited: ', category.id);
  }

  async onDeleteClicked(category: Category) {
    console.log('Deleted: ', category.id);
    await this.modal.open(ConfirmModalComponent, { style: ModalStyle.ConfirmModal });
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
