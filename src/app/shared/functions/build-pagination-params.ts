import { HttpParams } from '@angular/common/http';
import { PaginationOptions } from '../models';

export function buildPaginationParams(options: PaginationOptions): HttpParams {
  let params = new HttpParams().set('page', options.page).set('limit', options.limit);

  if (options.orderField) {
    params = params.set('orderField', options.orderField);
  }

  if (options.orderDirection) {
    params = params.set('orderDirection', options.orderDirection);
  }

  if (options.search) {
    params = params.set('search', options.search);
  }

  return params;
}
