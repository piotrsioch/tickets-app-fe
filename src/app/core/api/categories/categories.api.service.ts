import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments';
import { PaginationOptions, PaginationOutput } from '../../../shared/models';
import { buildPaginationParams, withAuthHeaders } from '../../../shared/functions';
import { firstValueFrom } from 'rxjs';
import { Category, CreateCategory } from './types';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  http = inject(HttpClient);

  async createCategory(data: CreateCategory): Promise<Category> {
    const headers = withAuthHeaders();
    const category$ = this.http.post<Category>(`${environment.apiRoot}/categories`, data, { ...headers });

    return await firstValueFrom(category$);
  }

  async getAllCategories(options: PaginationOptions): Promise<PaginationOutput<Category>> {
    const params = buildPaginationParams(options);
    const categories$ = this.http.get<PaginationOutput<Category>>(`${environment.apiRoot}/categories`, { params });

    return await firstValueFrom(categories$);
  }

  async getMainCategories(options: PaginationOptions): Promise<PaginationOutput<Category>> {
    const params = buildPaginationParams(options);
    const categories$ = this.http.get<PaginationOutput<Category>>(`${environment.apiRoot}/categories/main`, { params });

    return await firstValueFrom(categories$);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category$ = this.http.get<Category>(`${environment.apiRoot}/categories/${id}`);

    return await firstValueFrom(category$);
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    const headers = withAuthHeaders();
    const category$ = this.http.put<Category>(`${environment.apiRoot}/categories/${id}`, data, { ...headers });

    return await firstValueFrom(category$);
  }

  async deleteCategory(id: number): Promise<void> {
    const headers = withAuthHeaders();
    const category$ = this.http.delete<void>(`${environment.apiRoot}/categories/${id}`, { ...headers });

    return await firstValueFrom(category$);
  }
}
