import { Component, computed, input, output } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomDatasource, PageChangeEvent, TableColumn } from './table.assets';

@Component({
  selector: 'tickets-table',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> {
  isPageable = input<boolean>(false);
  tableColumns = input.required<TableColumn[]>();
  paginationSizes = input<number[]>([5, 10, 20]);
  defaultPageSize = input<number>(this.paginationSizes()[0]);
  totalItemCount = input<number>(0);
  tableData = input<CustomDatasource<T>>({ data: [], total: 0 });

  pageChanged = output<PageChangeEvent>();

  displayedColumns = computed(() => this.tableColumns().map(column => column.name));

  tableDataSource = computed(() => new MatTableDataSource<T>(this.tableData()?.data));

  pageChangeEvent(event: PageChangeEvent): void {
    console.log('emited');
    this.pageChanged.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
