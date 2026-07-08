"use client";

import type { Product } from '@/types/order';

export function ProductCatalog({ products, selectedId, onSelect }: {
  products: Product[];
  selectedId?: string;
  onSelect: (product: Product) => void;
}) {
  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2>Digital vouchers</h2>
        </div>
        <span className="pill">{products.length} active</span>
      </div>

      <div className="productGrid">
        {products.map((product) => (
          <button
            type="button"
            key={product.id}
            className={`productCard ${selectedId === product.id ? 'selected' : ''}`}
            onClick={() => onSelect(product)}
          >
            <span className="productCategory">{product.category}</span>
            <strong>{product.name}</strong>
            <span>{product.description}</span>
            <b>{product.priceLabel}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
