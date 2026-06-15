import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR', symbol = '₹') {
  if (currency === 'INR') return `₹${Number(amount || 0).toFixed(2)}`;
  return `${symbol}${Number(amount || 0).toFixed(2)}`;
}

export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function daysBetween(date1, date2 = new Date()) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  return diff;
}

export function calculateFine(dueDate, finePerDay) {
  const lateDays = daysBetween(dueDate);
  if (lateDays <= 0) return 0;
  return lateDays * finePerDay;
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
