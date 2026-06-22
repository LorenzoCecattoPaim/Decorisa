const supabase = require('../config/supabase');
const mailer   = require('../utils/mailer');

/**
 * Dispara notificações de retorno ao estoque para um produto.
 * Deve ser chamado sempre que o estoque de um produto sobe de 0
 * para um valor positivo (reabastecimento).
 *
 * - Localiza todos os inscritos pendentes do produto;
 * - Envia e-mail individual para cada um;
 * - Marca como 'notified' apenas os que tiveram envio confirmado;
 * - Tolera falhas de e-mail individuais sem interromper o lote.
 *
 * @param {string} productId
 */
async function notifyStockReplenished(productId) {
  try {
    const { data: product, error: pErr } = await supabase
      .from('products')
      .select('id,name,slug,stock, images:product_images(url,is_cover)')
      .eq('id', productId)
      .single();

    if (pErr || !product) return;
    if (Number(product.stock) <= 0) return; // só dispara se realmente há estoque agora

    const { data: pending, error } = await supabase
      .from('stock_notifications')
      .select('id,name,email')
      .eq('product_id', productId)
      .eq('status', 'pending');

    if (error) {
      console.error('[stock-notifications] Erro ao buscar inscritos:', error.message);
      return;
    }
    if (!pending?.length) return;

    const cover = (product.images || []).find(i => i.is_cover) || product.images?.[0];
    const productUrl = `${process.env.FRONTEND_URL}/pages/produto.html?slug=${product.slug}`;

    const results = await Promise.allSettled(
      pending.map(n =>
        mailer.sendStockReplenished({
          to: n.email,
          name: n.name || 'Cliente',
          productName: product.name,
          productImage: cover?.url || null,
          productUrl,
        })
      )
    );

    const succeededIds = pending
      .filter((_, idx) => results[idx].status === 'fulfilled')
      .map(n => n.id);

    if (succeededIds.length) {
      await supabase
        .from('stock_notifications')
        .update({ status: 'notified', notified_at: new Date().toISOString() })
        .in('id', succeededIds);
    }

    const failedCount = results.filter(r => r.status === 'rejected').length;
    if (failedCount) {
      console.error(`[stock-notifications] ${failedCount} e-mail(s) falharam para o produto "${product.name}" (${productId})`);
    }

    console.log(`[stock-notifications] ${succeededIds.length}/${pending.length} notificações enviadas para "${product.name}"`);
  } catch (err) {
    console.error('[stock-notifications] Erro ao processar reabastecimento:', err.message);
  }
}

module.exports = { notifyStockReplenished };
