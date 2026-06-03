const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '465'),
  secure: true,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

const logoUrl = process.env.FRONTEND_URL + '/assets/svg/logo-email.png';

function base(content) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;background:#F0EBE3;font-family:'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:580px;margin:40px auto;background:#F9F7F4}
  .header{background:#2C2A26;padding:32px 40px;text-align:center}
  .logo-text{color:#F0EBE3;font-size:22px;letter-spacing:0.2em;text-transform:uppercase;font-weight:300}
  .logo-text em{font-style:italic;color:#9A9288}
  .body{padding:40px}
  .footer{background:#EDE9E3;padding:20px 40px;text-align:center;font-size:11px;color:#8A8478;letter-spacing:0.06em}
  h2{font-size:24px;font-weight:300;color:#2C2A26;margin:0 0 20px}
  p{font-size:14px;line-height:1.75;color:#4A4840;margin:0 0 16px}
  .btn{display:inline-block;background:#2C2A26;color:#F9F7F4;padding:13px 28px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;margin:16px 0}
  .divider{height:0.5px;background:#D8D0C8;margin:24px 0}
  .order-table{width:100%;border-collapse:collapse;font-size:13px}
  .order-table td{padding:10px 0;border-bottom:0.5px solid #D8D0C8;color:#4A4840}
  .order-table td:last-child{text-align:right;font-weight:500}
  .total-row td{padding-top:14px;font-size:15px;color:#2C2A26;font-weight:600;border-bottom:none}
</style></head>
<body><div class="wrap">
  <div class="header"><div class="logo-text">Deco<em>risa</em></div></div>
  <div class="body">${content}</div>
  <div class="footer">
    © 2025 Decorisa · São Paulo, SP · <a href="mailto:contato@decorisa.com.br" style="color:#8A8478">contato@decorisa.com.br</a><br>
    <a href="${process.env.FRONTEND_URL}/privacidade" style="color:#8A8478">Política de privacidade</a>
  </div>
</div></body></html>`;
}

const mailer = {
  async sendWelcome({ to, name }) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Bem-vinda à Decorisa 🌿',
      html: base(`
        <h2>Olá, ${name}!</h2>
        <p>Que bom ter você por aqui. Sua conta foi criada com sucesso na <strong>Decorisa</strong>.</p>
        <p>Explore nossa coleção de objetos artesanais em concreto — cada peça é produzida sob demanda com cuidado único.</p>
        <a href="${process.env.FRONTEND_URL}/loja" class="btn">Explorar coleção</a>
        <div class="divider"></div>
        <p style="font-size:12px;color:#8A8478">Se não criou esta conta, ignore este e-mail.</p>
      `)
    });
  },

  async sendOrderConfirmed({ to, name, order }) {
    const itemsHTML = order.items.map(i =>
      `<tr><td>${i.product_name} × ${i.quantity}</td><td>R$ ${Number(i.total_price).toFixed(2).replace('.',',')}</td></tr>`
    ).join('');

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: `Pedido ${order.order_number} confirmado — Decorisa`,
      html: base(`
        <h2>Pedido confirmado!</h2>
        <p>Olá, <strong>${name}</strong>. Recebemos seu pedido e já estamos preparando tudo com carinho.</p>
        <div class="divider"></div>
        <p><strong>Pedido:</strong> ${order.order_number}</p>
        <table class="order-table">
          ${itemsHTML}
          ${order.discount > 0 ? `<tr><td>Desconto</td><td>− R$ ${Number(order.discount).toFixed(2).replace('.',',')}</td></tr>` : ''}
          <tr><td>Frete</td><td>${order.shipping_cost > 0 ? 'R$ ' + Number(order.shipping_cost).toFixed(2).replace('.',',') : 'Grátis'}</td></tr>
          <tr class="total-row"><td>Total</td><td>R$ ${Number(order.total).toFixed(2).replace('.',',')}</td></tr>
        </table>
        <div class="divider"></div>
        <p>O prazo de produção artesanal é de <strong>${order.production_days || 7} a ${(order.production_days || 7) + 3} dias úteis</strong> após a confirmação do pagamento. Você receberá um e-mail com o código de rastreio assim que o pedido for enviado.</p>
        <a href="${process.env.FRONTEND_URL}/cliente" class="btn">Acompanhar pedido</a>
      `)
    });
  },

  async sendOrderShipped({ to, name, orderNumber, trackingCode }) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: `Seu pedido ${orderNumber} foi enviado! 📦`,
      html: base(`
        <h2>Sua peça está a caminho!</h2>
        <p>Olá, <strong>${name}</strong>. O pedido <strong>${orderNumber}</strong> saiu para entrega.</p>
        ${trackingCode ? `
          <div class="divider"></div>
          <p><strong>Código de rastreio:</strong></p>
          <p style="font-size:18px;letter-spacing:0.12em;color:#2C2A26;background:#EDE9E3;padding:14px 20px;display:inline-block">${trackingCode}</p>
          <p><a href="https://rastreamento.correios.com.br/app/index.php" target="_blank" style="color:#2C2A26">Rastrear nos Correios →</a></p>
        ` : ''}
        <div class="divider"></div>
        <p>Esperamos que você aprecie cada detalhe da sua peça artesanal. ✨</p>
        <a href="${process.env.FRONTEND_URL}/cliente" class="btn">Ver meus pedidos</a>
      `)
    });
  },

  async sendPasswordReset({ to, name, resetUrl }) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Redefinição de senha — Decorisa',
      html: base(`
        <h2>Redefinir senha</h2>
        <p>Olá, <strong>${name}</strong>. Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p>Clique no botão abaixo. O link é válido por <strong>1 hora</strong>.</p>
        <a href="${resetUrl}" class="btn">Redefinir senha</a>
        <div class="divider"></div>
        <p style="font-size:12px;color:#8A8478">Se não solicitou a redefinição, ignore este e-mail. Sua senha não será alterada.</p>
      `)
    });
  },

  async sendContactMessage({ name, email, subject, message }) {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `[Contato] ${subject} — ${name}`,
      html: base(`
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> <a href="mailto:${email}" style="color:#2C2A26">${email}</a></p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <div class="divider"></div>
        <p>${message.replace(/\n/g,'<br>')}</p>
      `)
    });
  }
};

module.exports = mailer;
