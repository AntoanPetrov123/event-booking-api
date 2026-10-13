import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generateQrCode(ticketCode: string): Promise<Buffer> {
    return QRCode.toBuffer(ticketCode, {
      type: 'png',
      width: 400,
      margin: 2,
    });
  }
}
