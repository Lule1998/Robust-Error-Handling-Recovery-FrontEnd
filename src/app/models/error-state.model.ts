import { ApiError } from "./api-error.model";

export interface ErrorState {
    error: ApiError | null;
    loading: boolean;
    retryCount: number;
  }