interface MagicLinkOptions {
  to: string;
  name?: string;
  magicLink: string;
}

export async function sendMagicLink({ to, name, magicLink }: MagicLinkOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[MAGIC LINK — dev] ${to}\n${magicLink}\n`);
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Leerplatform <noreply@leerplatform.nl>",
    to,
    subject: "Jouw inloglink voor Leerplatform",
    html: `
      <p>Hallo${name ? ` ${name}` : ""},</p>
      <p>Klik op de onderstaande knop om in te loggen. De link is <strong>15 minuten</strong> geldig en kan maar één keer gebruikt worden.</p>
      <p style="margin:24px 0">
        <a href="${magicLink}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Inloggen →
        </a>
      </p>
      <p style="color:#6b7280;font-size:13px">Heb je deze e-mail niet aangevraagd? Dan hoef je niets te doen.</p>
    `,
  });
}
