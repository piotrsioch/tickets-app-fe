import { Component, computed, input, model, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomDatasource, PageChangeEvent, TableColumn } from './table.assets';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'tickets-table',
  imports: [MatTableModule, MatPaginatorModule, MatFormField, MatInputModule, MatIcon, MatIconButton],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
})
export class TableComponent<T> {
  isSearchable = input<boolean>(false);
  isPageable = input<boolean>(false);
  tableColumns = input.required<TableColumn[]>();
  paginationSizes = input<number[]>([5, 10, 20]);
  defaultPageSize = input<number>(this.paginationSizes()[0]);
  totalItemCount = input<number>(0);
  tableData = input<CustomDatasource<T>>({ data: [], total: 0 });
  showActions = input<boolean>(true);

  pageChanged = output<PageChangeEvent>();
  searchChanged = output<string>();
  editClicked = output<T>();
  deleteClicked = output<T>();

  displayedColumns = computed(() => {
    const columns = this.tableColumns().map(column => column.name);
    return this.showActions() ? [...columns, 'Actions'] : columns;
  });
  searchValue = model<string>('');

  tableDataSource = computed(() => new MatTableDataSource<T>(this.tableData()?.data));

  pageChangeEvent(event: PageChangeEvent): void {
    this.pageChanged.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchValue.set(target.value);
  }

  onSearchChanged(): void {
    const searchValue = this.searchValue();
    this.searchChanged.emit(searchValue);
  }

  onDelete(data: T) {
    this.deleteClicked.emit(data);
  }

  onEdit(data: T) {
    this.editClicked.emit(data);
  }
}
