import { apiClient } from './axios';

export type MedicineTicketStatus = 'pending' | 'done';

export interface MedicineTicket {
  ticketID: string;
  orderNum: number | string;
  status: MedicineTicketStatus;
  prescriptionID: string;
  createdAt?: string;
}

export interface MedicineTicketsResponse {
  message: string;
  data: MedicineTicket[];
}

export interface CreateMedicineTicketPayload {
  prescriptionID: string;
}

export interface CreateMedicineTicketResponse {
  message: string;
  data: MedicineTicket;
}

export interface UpdateMedicineTicketStatusPayload {
  status: MedicineTicketStatus;
}

export interface UpdateMedicineTicketStatusResponse {
  message: string;
  data: MedicineTicket;
}

export type MedicineUnit = 'bottle' | 'capsule' | 'patches';

export interface MedicineItem {
  medicineID: number;
  medicineName: string;
  unit: MedicineUnit;
  price: number;
  description?: string;
  image?: string;
  [key: string]: unknown;
}

export interface CreateMedicineItemPayload {
  medicineName: string;
  unit: MedicineUnit;
  price: number;
  description?: string;
  image?: File | Blob;
}

export interface CreateMedicineItemResponse {
  message: string;
  data: MedicineItem;
}

export interface CreateManyMedicineItemInput {
  medicineName: string;
  unit: MedicineUnit;
  price: number;
  description?: string;
}

export type CreateManyMedicineItemsPayload = CreateManyMedicineItemInput[];

export interface CreateManyMedicineItemsResponse {
  message: string;
  data: {
    requestCount: number;
    successCount: number;
    failedCount: number;
    success: Array<{
      index: number;
      medicineName: string;
      [key: string]: unknown;
    }>;
    failed: Array<{
      index: number;
      medicineName: string;
      reason: string;
      [key: string]: unknown;
    }>;
  };
}

export interface GetMedicineItemsParams {
  search?: string;
  page?: number;
}

export interface GetMedicineItemsResponse {
  message: string;
  data: MedicineItem[] | {
    medicines?: MedicineItem[];
    items?: MedicineItem[];
    page?: number;
    totalPages?: number;
    totalItems?: number;
    [key: string]: unknown;
  };
}

export interface GetMedicineItemByIdResponse {
  message: string;
  data: MedicineItem;
}

export interface UpdateMedicineItemPayload {
  medicineName?: string;
  unit?: MedicineUnit;
  price?: number;
  description?: string;
  image?: File | Blob;
}

export interface UpdateMedicineItemResponse {
  message: string;
  data: MedicineItem;
}

export interface DeleteMedicineItemResponse {
  message: string;
  data?: unknown;
}

export type ImexType = 'import' | 'export';

export interface ImexItemPayload {
  medicineID: number;
  quantity: number;
  note?: string;
}

export interface ImexLog {
  imexID: string;
  imexType: ImexType;
  pharmacistID: string;
  value?: number;
  note?: string;
  items?: ImexItemPayload[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface GetImexLogsParams {
  type?: ImexType;
  from?: string;
  to?: string;
}

export interface GetImexLogsResponse {
  message: string;
  data: ImexLog[];
}

export interface GetImexByIdResponse {
  message: string;
  data: ImexLog;
}

export interface CreateImexLogPayload {
  imexType: ImexType;
  pharmacistID: string;
  value?: number;
  note?: string;
  items: ImexItemPayload[];
}

export interface CreateImexLogResponse {
  message: string;
  data: ImexLog;
}

export interface UpdateImexLogPayload {
  value?: number;
  note?: string;
  items?: ImexItemPayload[];
}

export interface UpdateImexLogResponse {
  message: string;
  data: ImexLog;
}

export interface DeleteImexLogResponse {
  message: string;
  data?: unknown;
}

class MedicineApi {
  private buildMedicineFormData(
    payload: CreateMedicineItemPayload | UpdateMedicineItemPayload
  ) {
    const formData = new FormData();

    if (payload.medicineName !== undefined) {
      formData.append('medicineName', payload.medicineName);
    }

    if (payload.unit !== undefined) {
      formData.append('unit', payload.unit);
    }

    if (payload.price !== undefined) {
      formData.append('price', String(payload.price));
    }

    if (payload.description !== undefined) {
      formData.append('description', payload.description);
    }

    if (payload.image !== undefined) {
      formData.append('image', payload.image);
    }

    return formData;
  }

  async createMedicineItem(payload: CreateMedicineItemPayload) {
    const formData = this.buildMedicineFormData(payload);
    const response = await apiClient.post<CreateMedicineItemResponse>(
      '/medicine/items',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async createManyMedicineItems(payload: CreateManyMedicineItemsPayload) {
    const response = await apiClient.post<CreateManyMedicineItemsResponse>(
      '/medicine/items/many',
      payload
    );
    return response.data;
  }

  async getMedicineItems(params?: GetMedicineItemsParams) {
    const response = await apiClient.get<GetMedicineItemsResponse>(
      '/medicine/items',
      {
        params,
      }
    );
    return response.data;
  }

  async getMedicineItemById(id: number | string) {
    const response = await apiClient.get<GetMedicineItemByIdResponse>(
      `/medicine/items/${id}`
    );
    return response.data;
  }

  async updateMedicineItem(
    id: number | string,
    payload: UpdateMedicineItemPayload
  ) {
    const formData = this.buildMedicineFormData(payload);
    const response = await apiClient.patch<UpdateMedicineItemResponse>(
      `/medicine/items/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async deleteMedicineItem(id: number | string) {
    const response = await apiClient.delete<DeleteMedicineItemResponse>(
      `/medicine/items/${id}`
    );
    return response.data;
  }

  async getImexLogs(params?: GetImexLogsParams) {
    const response = await apiClient.get<GetImexLogsResponse>('/medicine/imex', {
      params,
    });
    return response.data;
  }

  async getImexById(id: string) {
    const response = await apiClient.get<GetImexByIdResponse>(
      `/medicine/imex/${id}`
    );
    return response.data;
  }

  async createImexLog(payload: CreateImexLogPayload) {
    const response = await apiClient.post<CreateImexLogResponse>(
      '/medicine/imex',
      payload
    );
    return response.data;
  }

  async updateImexLog(id: string, payload: UpdateImexLogPayload) {
    const response = await apiClient.patch<UpdateImexLogResponse>(
      `/medicine/imex/${id}`,
      payload
    );
    return response.data;
  }

  async deleteImexLog(id: string) {
    const response = await apiClient.delete<DeleteImexLogResponse>(
      `/medicine/imex/${id}`
    );
    return response.data;
  }

  async createMedicineTicket(payload: CreateMedicineTicketPayload) {
    const response = await apiClient.post<CreateMedicineTicketResponse>(
      '/medicine/tickets',
      payload
    );
    return response.data;
  }

  async getMedicineTickets(params?: { date?: string }) {
    const response = await apiClient.get<MedicineTicketsResponse>(
      '/medicine/tickets',
      {
        params,
      }
    );
    return response.data;
  }

  async updateMedicineTicketStatus(
    ticketId: string,
    payload: UpdateMedicineTicketStatusPayload
  ) {
    const response = await apiClient.patch<UpdateMedicineTicketStatusResponse>(
      `/medicine/tickets/${ticketId}/status`,
      payload
    );
    return response.data;
  }
}

const medicineApi = new MedicineApi();
export default medicineApi;
