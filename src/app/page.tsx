"use client";

import { useRef, useState } from 'react';
import type { Product, UniVoucherOrder } from '@/types/order';
import { useSphereConnect } from '@/lib/sphere/useSphereConnect';
import { getActiveProducts, getProductById } from '@/lib/catalog';
import { SphereConnectCard } from '@/components/SphereConnectCard';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CheckoutPanel } from '@/components/CheckoutPanel';
import { OrderHistory } from '@/components/OrderHistory';
import { AgentChat } from '@/components/AgentChat';

const products = getActiveProducts();

export default function HomePage() {
  const sphere = useSphereConnect();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(products[0]);
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const ordersRef = useRef<HTMLDivElement | null>(null);

  function selectProductById(productId: string) {
    const product = getProductById(productId);
    if (product) setSelectedProduct(product);
  }

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleOrderSaved(_order: UniVoucherOrder) {
    scrollTo(ordersRef);
    void sphere.refreshWalletView();
  }

  return (
    <main className="pageShell">
      <header className="hero">
        <p className="eyebrow">Unicity Sphere / testnet2</p>
        <h1>UniVoucher</h1>
        <p>
          Connect-first digital voucher marketplace starter. Payment uses Sphere Connect intent <code>send</code> with
          base-unit amount and canonical 64-hex coinId.
        </p>
      </header>

      <SphereConnectCard {...sphere} />

      <div className="layoutGrid">
        <div className="leftColumn">
          <AgentChat
            onSelectProduct={selectProductById}
            onShowCatalog={() => scrollTo(catalogRef)}
            onShowOrders={() => scrollTo(ordersRef)}
          />
          <div ref={catalogRef}>
            <ProductCatalog
              products={products}
              selectedId={selectedProduct?.id}
              onSelect={setSelectedProduct}
            />
          </div>
        </div>

        <div className="rightColumn">
          <CheckoutPanel
            product={selectedProduct}
            connected={sphere.connected}
            identity={sphere.identity}
            sendPayment={sphere.sendPayment}
            onOrderSaved={handleOrderSaved}
          />
          <div ref={ordersRef}>
            <OrderHistory />
          </div>
        </div>
      </div>
    </main>
  );
}
