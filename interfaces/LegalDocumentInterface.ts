export enum BelongsTo {
  user = 'user',
  property = 'property',
  application = 'application',
}

export enum LegalDocumentStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
  expired = 'expired',
}

export interface LegalDocument {
  id: string;
  id_user: string | null;
  id_property: string | null;
  id_application: string | null;
  belongs_to: BelongsTo;
  type: string;
  description: string | null;
  notes: string | null;
  url_document: string;
  upload_date: string; // ISO date string
  status: LegalDocumentStatus;
}

export interface GetUserLegalDocumentsResponse {
  success: boolean;
  data: LegalDocument[];
  message?: string;
  statusCode?: number;
}
