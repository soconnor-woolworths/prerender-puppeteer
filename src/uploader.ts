import { BlobServiceClient } from '@azure/storage-blob';
require('dotenv').config();

export class Uploader {
  // Should be set as an environment variable
  private readonly AZURE_STORAGE_CONNECTION_STRING =
    process.env.AZURE_STORAGE_CONNECTION_STRING;
  private readonly containerName = 'prerendered-pages';

  constructor() {}

  public async uploadFile(pageUrl: string, fileData: string) {
    this.uploadToBlobStorage(pageUrl, fileData);
  }

  private async uploadToBlobStorage(pageUrl: string, fileData: string) {
    if (!this.AZURE_STORAGE_CONNECTION_STRING) {
      throw Error('Azure Storage Connection string not found');
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.AZURE_STORAGE_CONNECTION_STRING
    );

    const containerClient = blobServiceClient.getContainerClient(
      this.containerName
    );
    const blobName = this.getBlobName(pageUrl);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);
    const uploadBlobResponse = await blockBlobClient.upload(
      fileData,
      fileData.length
    );
    console.log(
      'Blob was uploaded successfully. requestId: ',
      uploadBlobResponse.requestId
    );
  }

  private getBlobName(pageUrl: string): string {
    // TODO: Work out blob name
    // Hash the url name
    return 'test.html';
  }
}
