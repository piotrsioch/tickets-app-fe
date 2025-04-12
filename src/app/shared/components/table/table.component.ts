import { Component, computed, input, model, OnDestroy, output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CustomDatasource, PageChangeEvent, TableColumn } from './table.assets';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'tickets-table',
  imports: [MatTableModule, MatPaginatorModule, MatFormField, MatInputModule, MatIcon, MatIconButton, DatePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
})
export class TableComponent<T> implements OnDestroy {
  private searchSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  canAddItem = input<boolean>(false);
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
  rowClicked = output<T>();
  addClicked = output<void>();

  displayedColumns = computed(() => {
    const columns = this.tableColumns().map(column => column.name);
    return this.showActions() ? [...columns, 'Actions'] : columns;
  });
  searchValue = model<string>('');
  search$ = toObservable(this.searchValue);

  tableDataSource = computed(() => new MatTableDataSource<T>(this.tableData()?.data));

  constructor() {
    this.searchSubscription = this.search$.pipe(debounceTime(400)).subscribe(value => {
      this.searchChanged.emit(value);
    });
  }

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

  onRowClicked(data: T) {
    this.rowClicked.emit(data);
  }

  onAddClicked() {
    this.addClicked.emit();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
