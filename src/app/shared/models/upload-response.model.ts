export interface UploadResponseModel {
  dataResults: {
    report: string,
    result: string
  }[];
  filename: string;
  message: string;
  result: string;
}
