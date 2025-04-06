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

  if (options.search && options?.searchFields && options.search.length > 0) {
    params = params.set('search', options.search);

    const searchFields: string = options.searchFields.join(',');
    params = params.set('searchFields', searchFields);
  }

  return params;
}
