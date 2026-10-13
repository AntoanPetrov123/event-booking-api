import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailtrapClient } from 'mailtrap';
import { IssuedTicket } from '../tickets/entities/issued-ticket.entity.js';

@Injectable()
export class MailService {
  private readonly client: MailtrapClient;

  constructor(private readonly configService: ConfigService) {
    this.client = new MailtrapClient({
      token: this.configService.getOrThrow('MAILTRAP_TOKEN'),
    });
  }

  async sendTickets(
    email: string,
    tickets: {
      ticket: IssuedTicket;
      qrCode: Buffer;
    }[],
  ) {
    const attachments = tickets.map(({ ticket, qrCode }) => ({
      filename: `ticket-${ticket.id}.png`,
      content: qrCode.toString('base64'),
      type: 'image/png',
      disposition: 'attachment',
    }));

    const ticketsHtml = tickets
      .map(
        ({ ticket }) => `
          <div
            style="
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
            "
          >
            <h2>${ticket.ticketName}</h2>

            <p>
              Ticket ID:
              <strong>${ticket.id}</strong>
            </p>

            <p>
              Ticket code:
              <strong>${ticket.code}</strong>
            </p>
          </div>
        `,
      )
      .join('');

    return this.client.send({
      from: {
        email: this.configService.getOrThrow('MAIL_FROM_EMAIL'),
        name: this.configService.get('MAIL_FROM_NAME') ?? 'Event Booking',
      },

      to: [
        {
          email,
        },
      ],

      subject: 'Your event tickets',

      text: 'Thank you for your purchase. Your tickets are attached to this email.',

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
          "
        >
          <h1>
            Thank you for your purchase!
          </h1>

          <p>
            Your tickets are ready.
            The QR codes are attached to this email.
          </p>

          ${ticketsHtml}

          <p>
            Please show the QR code when entering the event.
          </p>
        </div>
      `,

      attachments,

      category: 'Ticket Purchase',
    });
  }
}
