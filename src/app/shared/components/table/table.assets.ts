export interface TableColumn {
  name: string;
  dataKey: string;
}

export interface CustomDatasource<T> {
  data: T[];
  total: number;
}

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
}
