-- ============================================================
-- MIGRATION: Cores do Marmorizado — Decorisa
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. SUBSTITUIR cores padrão das peças (customization_colors)
-- ============================================================

-- Limpa cores antigas do seed padrão (só as que não estão em uso)
DELETE FROM customization_colors
WHERE name IN ('Areia','Cinza Claro','Cinza Escuro','Preto')
  AND id NOT IN (SELECT DISTINCT color_id FROM product_available_colors);

-- Insere as 10 cores novas (ignora se já existir pelo nome)
INSERT INTO customization_colors (id, name, hex, sort_order, active)
SELECT gen_random_uuid(), v.name, v.hex, v.sort_order, true
FROM (VALUES
  ('Branco',  '#F9F7F4', 1),
  ('Bege',    '#E8D9C0', 2),
  ('Cinza',   '#A8A49F', 3),
  ('Marrom',  '#7B5534', 4),
  ('Rosa',    '#E8A0B0', 5),
  ('Laranja', '#E8885A', 6),
  ('Amarelo', '#E8D55A', 7),
  ('Verde',   '#6AAE78', 8),
  ('Azul',    '#4A78D0', 9),
  ('Roxo',    '#8B5FBF', 10)
) AS v(name, hex, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM customization_colors cc WHERE cc.name = v.name
);

-- ============================================================
-- 2. TABELA DE CORES DO MARMORIZADO
-- ============================================================
CREATE TABLE IF NOT EXISTS marble_colors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  hex        TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active     BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insere cores padrão do marmorizado (ignora se já existir pelo nome)
INSERT INTO marble_colors (id, name, hex, sort_order, active)
SELECT gen_random_uuid(), v.name, v.hex, v.sort_order, true
FROM (VALUES
  ('Branco',  '#F9F7F4', 1),
  ('Creme',   '#F0E6C8', 2),
  ('Cinza',   '#A8A49F', 3),
  ('Rosa',    '#E8A0B0', 4),
  ('Laranja', '#E8885A', 5),
  ('Amarelo', '#E8D55A', 6),
  ('Verde',   '#6AAE78', 7),
  ('Azul',    '#4A78D0', 8),
  ('Roxo',    '#8B5FBF', 9)
) AS v(name, hex, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM marble_colors mc WHERE mc.name = v.name
);

-- ============================================================
-- 3. TABELA: CORES DE MARMORIZADO DISPONÍVEIS POR PRODUTO
-- ============================================================
CREATE TABLE IF NOT EXISTS product_available_marble_colors (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_id   UUID REFERENCES marble_colors(id) ON DELETE CASCADE,
  UNIQUE(product_id, color_id)
);

CREATE INDEX IF NOT EXISTS idx_pamc_product
  ON product_available_marble_colors(product_id);

-- ============================================================
-- 4. CAMPO marble_color NA TABELA order_items
-- ============================================================
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS marble_color TEXT;

-- ============================================================
-- VERIFICAÇÃO (execute para confirmar)
-- ============================================================
-- SELECT COUNT(*) FROM marble_colors;                          -- deve retornar 9
-- SELECT COUNT(*) FROM customization_colors WHERE active=true; -- deve retornar 10+
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name='order_items' AND column_name='marble_color';
