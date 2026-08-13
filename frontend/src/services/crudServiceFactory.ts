import { httpClient } from "./httpClient";

/**
 * Every backend resource follows the same GET/GET-by-id/POST/PUT/DELETE
 * shape (see backend/src/main/java/.../controller). This factory generates
 * a typed client for one, so each domain service file only has to declare
 * its resource path and any extra endpoints beyond plain CRUD.
 */
export function createCrudService<T, TCreateDto = Partial<T>, TUpdateDto = TCreateDto>(resourcePath: string) {
  return {
    findAll: async (): Promise<T[]> => (await httpClient.get<T[]>(resourcePath)).data,
    findById: async (id: string): Promise<T> => (await httpClient.get<T>(`${resourcePath}/${id}`)).data,
    create: async (payload: TCreateDto): Promise<T> => (await httpClient.post<T>(resourcePath, payload)).data,
    update: async (id: string, payload: TUpdateDto): Promise<T> => (await httpClient.put<T>(`${resourcePath}/${id}`, payload)).data,
    remove: async (id: string): Promise<void> => {
      await httpClient.delete(`${resourcePath}/${id}`);
    },
  };
}
