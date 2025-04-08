export interface TableColumn {
  name: string;
  dataKey: string;
  type?: 'date' | 'default';
}

export interface CustomDatasource<T> {
  data: T[];
  total: number;
}

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
}
