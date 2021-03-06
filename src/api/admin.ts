import { APIPrefix } from '@/global';
import requests, { RequestBody } from '@/utils/requests';

export interface FetchClientListBody extends RequestBody {
  limit?: number;
  offset?: number;
}

export interface FetchClientQuery {
  type: 'staff' | 'postgraduate';
  key?: string;
}

export interface FetchClientListPayload {
  body: FetchClientListBody;
  query: FetchClientQuery;
}

export async function fetchClientList(payload: FetchClientListPayload) {
  return requests<FetchClientListBody>(`${APIPrefix}/admin/client/${payload.query.type}/list`, {
    body: payload.body,
    method: 'POST',
  });
}

export interface DeleteClientPayload {
  query: FetchClientQuery;
}

export async function deleteClient({ query }: DeleteClientPayload) {
  return requests(`${APIPrefix}/admin/client/${query.type}/delete/${query.key}`, {
    method: 'POST',
  });
}

export interface CreateClientBody extends RequestBody {
  [key: string]: any;
}

export interface CreateClientPayload {
  body: CreateClientBody;
  query: FetchClientQuery;
}

export async function createClient({ body, query }: CreateClientPayload) {
  return requests<CreateClientBody>(`${APIPrefix}/admin/client/${query.type}/create`, {
    body,
    method: 'POST',
  });
}

export interface EditClientBody extends RequestBody {
  [key: string]: any;
}

export interface EditClientPayload {
  body: EditClientBody;
  query: FetchClientQuery;
}

export async function editClient({ body, query }: EditClientPayload) {
  return requests<EditClientBody>(`${APIPrefix}/admin/client/${query.type}/edit/${query.key}`, {
    body,
    method: 'POST',
  });
}

export interface TimeConfig {
  id?: number;
  used: number;
  position_start: number;
  position_end: number;
  apply_start: number;
  apply_end: number;
}

export interface FetchTimePayload {
  action: string;
  body?: { [key: string]: any };
}

export async function timeConfig({ action, body }: FetchTimePayload) {
  return requests(`${APIPrefix}/admin/time/${action}`, { body, method: 'POST' });
}
