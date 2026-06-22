const supabase = require('../config/supabase');
const mailer   = require('../utils/mailer');

/**
 * Processa notificações de retorno ao estoque.
 *
 * PROTEÇÕES DE CONCORRÊNCIA:
 * - Usa UPDATE atômico com WHERE status='pending' antes de enviar,
 *   reservando os registros para esta execução específica.
 * - Mesmo que dois processos chamem esta função simultaneamente,
 *   apenas um irá reservar e enviar cada notificação.
 *
 * IDEMPOTÊNCIA:
 * - Notificações já 'notified' ou 'cancelled' são ignoradas.
 * - Re-execução sobre o mesmo produto não envia duplicatas.
 *
 * @param {string} productId
 * @param {number} previousStock - estoque anterior (deve ser <= 0)
 * @param {number} currentStock  - estoque atual (deve ser > 0)
 */
async function processBackInStockNotifications(productId, previousStock, currentStock) {
  const tag = '[BACK_IN_STOCK]';

  console.log(`${tag} product=${productId} previous=${previousStock} current=${currentStock}`);

  // Validação da transição real (0 → positivo)
  if (Number(previousStock) > 0) {
    console.log(`${tag} skip — estoque anterior já era positivo (${previousStock}), nenhuma notificação necessária`);
    return;
  }
  if (Number(currentStock) <= 0) {
    console.log(`${tag} skip — estoque atual ainda é zero ou negativo (${currentStock})`);
    return;
  }

  // Diagnóstico de variáveis de ambiente do mailer (sem expor senhas)
  const mailConfigured = !!(
    process.env.MAIL_HOST &&
    process.env.MAIL_USER &&
    process.env.MAIL_PASS &&
    process.env.MAIL_FROM
  );
  if (!mailConfigured) {
    console.error(`${tag} ERRO — variáveis de e-mail não configuradas. Verifique MAIL_HOST, MAIL_USER, MAIL_PASS, MAIL_FROM no ambiente.`);
    return;
  }

  try {
    // 1. Buscar dados do produto com imagens
    const { data: product, error: pErr } = await supabase
      .from('products')
      .select('id, name, slug, stock, images:product_images(url, is_cover)')
      .eq('id', productId)
      .single();

    if (pErr) {
      console.error(`${tag} Erro ao buscar produto ${productId}:`, pErr.message);
      return;
    }
    if (!product) {
      console.error(`${tag} Produto ${productId} não encontrado`);
      return;
    }

    // 2. Buscar notificações pendentes
    const { data: pending, error: nErr } = await supabase
      .from('stock_notifications')
      .select('id, name, email')
      .eq('product_id', productId)
      .eq('status', 'pending');

    if (nErr) {
      console.error(`${tag} Erro ao buscar inscritos para ${productId}:`, nErr.message);
      return;
    }

    if (!pending?.length) {
      console.log(`${tag} product=${productId} — nenhuma notificação pendente, concluído`);
      return;
    }

    console.log(`${tag} pending_notifications=${pending.length} product="${product.name}"`);

    // 3. PROTEÇÃO DE CONCORRÊNCIA:
    // Marca atomicamente as notificações como 'notified' ANTES de enviar os e-mails.
    // Usa returning=representation para obter apenas os que realmente foram atualizados
    // (evita que outro processo paralelo os processe também).
    const pendingIds = pending.map(n => n.id);
    const nowIso = new Date().toISOString();

    const { data: reserved, error: rErr } = await supabase
      .from('stock_notifications')
      .update({ status: 'notified', notified_at: nowIso })
      .in('id', pendingIds)
      .eq('status', 'pending')  // WHERE garante que só pega os ainda pending (idempotência)
      .select('id, name, email');

    if (rErr) {
      console.error(`${tag} Erro ao reservar notificações:`, rErr.message);
      return;
    }

    if (!reserved?.length) {
      console.log(`${tag} product=${productId} — nenhuma notificação reservada (já processadas por outra instância)`);
      return;
    }

    console.log(`${tag} reserved=${reserved.length} notifications para produto "${product.name}"`);

    // 4. Preparar dados do e-mail
    const cover = (product.images || []).find(i => i.is_cover) || product.images?.[0];
    const productUrl = `${process.env.FRONTEND_URL}/pages/produto.html?slug=${product.slug}`;

    // 5. Enviar e-mails para os reservados (não mais os originais 'pending')
    // Se um e-mail falhar, reverte o status para 'pending' para retry futuro.
    const results = await Promise.allSettled(
      reserved.map(async n => {
        try {
          await mailer.sendStockReplenished({
            to:           n.email,
            name:         n.name || 'Cliente',
            productName:  product.name,
            productImage: cover?.url || null,
            productUrl,
          });
          console.log(`${tag} email_sent=${n.email} product="${product.name}"`);
          return { id: n.id, success: true };
        } catch (mailErr) {
          console.error(`${tag} email_failed=${n.email} error="${mailErr.message}"`);
          return { id: n.id, success: false, error: mailErr.message };
        }
      })
    );

    // 6. Processar resultados
    const succeeded = results
      .filter(r => r.status === 'fulfilled' && r.value?.success)
      .map(r => r.value.id);

    const failed = results
      .filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value?.success))
      .map(r => r.value?.id || null)
      .filter(Boolean);

    // 7. Reverter para 'pending' os que falharam (para retry futuro)
    if (failed.length) {
      const { error: revertErr } = await supabase
        .from('stock_notifications')
        .update({ status: 'pending', notified_at: null })
        .in('id', failed);

      if (revertErr) {
        console.error(`${tag} Erro ao reverter notificações falhas:`, revertErr.message);
      } else {
        console.log(`${tag} ${failed.length} notificações revertidas para pending (falha no envio)`);
      }
    }

    console.log(`${tag} completed product="${product.name}" product_id=${productId} sent=${succeeded.length} failed=${failed.length} total=${reserved.length}`);

  } catch (err) {
    console.error(`${tag} Erro inesperado ao processar produto ${productId}:`, err?.stack || err?.message || err);
  }
}

module.exports = { processBackInStockNotifications };
