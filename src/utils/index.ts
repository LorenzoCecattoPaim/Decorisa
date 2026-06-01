// src/utils/index.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDatetime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DEC-${timestamp}-${random}`
}

export function maskDocument(doc: string): string {
  const clean = doc.replace(/\D/g, '')
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

export function maskPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

export function maskZipCode(zip: string): string {
  return zip.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
}

export function calculateDiscount(price: number, couponType: string, couponValue: number): number {
  if (couponType === 'PERCENTAGE') {
    return (price * couponValue) / 100
  }
  return Math.min(couponValue, price)
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Aguardando confirmação',
    CONFIRMED: 'Confirmado',
    IN_PRODUCTION: 'Em produção',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
    REFUNDED: 'Reembolsado',
  }
  return labels[status] ?? status
}

export function getPaymentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    FAILED: 'Falhou',
    REFUNDED: 'Reembolsado',
  }
  return labels[status] ?? status
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    PIX: 'Pix',
    CREDIT_CARD: 'Cartão de crédito',
    BOLETO: 'Boleto bancário',
    MERCADO_PAGO: 'Mercado Pago',
  }
  return labels[method] ?? method
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function getAverageRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
