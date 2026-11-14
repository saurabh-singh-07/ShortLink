
export interface QRCodeType {
  id: string;
  originalUrl: string;
  createdAt: string;
}

export interface QRCodeResponse {
  success: boolean;
  count: number;
  qrCodes: QRCodeType[];
}
