import { Component, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { CategoriesApiService, Category } from '../../core/api/categories';
import { ActivatedRoute } from '@angular/router';
import { CustomDatasource, PageChangeEvent, TableColumn } from '../../shared/components/table/table.assets';

@Component({
  selector: 'tickets-categories',
  imports: [TableComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
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
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadCategories();
  }

  onPageChanged(e: PageChangeEvent) {
    console.log('revived', e);
  }

  private async loadCategories(): Promise<void> {
    const categories = await this.categoriesApiService.getAllCategories({ page: 0, limit: 10 });
    const mappedCategories: CustomDatasource<Category> = {
      data: categories.items,
      total: categories.total,
    };

    this.categories.set(mappedCategories);
  }
}
