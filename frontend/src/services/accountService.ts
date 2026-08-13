import { httpClient } from "./httpClient";
import type { UserRole } from "../types/user";

/** Admin-only account management — GET/PUT/DELETE /api/accounts (requires ROLE_ADMIN). */
export interface AccountResponse {
  accountId: string;
  userId: string;
  username: string;
  accountStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  role: UserRole;
}

interface AccountUpdateDto {
  accountStatus: AccountResponse["accountStatus"];
  role: UserRole;
}

export const accountService = {
  findAll: async (): Promise<AccountResponse[]> => (await httpClient.get<AccountResponse[]>("/accounts")).data,
  findById: async (id: string): Promise<AccountResponse> => (await httpClient.get<AccountResponse>(`/accounts/${id}`)).data,
  update: async (id: string, payload: AccountUpdateDto): Promise<void> => {
    await httpClient.put(`/accounts/${id}`, payload);
  },
  remove: async (id: string): Promise<void> => {
    await httpClient.delete(`/accounts/${id}`);
  },
};
