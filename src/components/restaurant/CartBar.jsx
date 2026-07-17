export default function CartBar({ totalCount, totalPrice, couponAmount, onToggleCart, onCheckout }) {
  const hasItems = totalCount > 0;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Bag icon with badge */}
        <div
          onClick={onToggleCart}
          style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-yellow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 9V6a3 3 0 016 0v3"/></svg>
          {hasItems && (
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                lineHeight: 1,
              }}
            >
              {totalCount}
            </div>
          )}
        </div>

        {/* Price and savings */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#111', lineHeight: 1.2 }}>
            ¥{totalPrice}
          </span>
          {hasItems && (
            <span style={{ fontSize: '11px', color: '#22c55e', lineHeight: 1.2, marginTop: '2px' }}>
              已省¥{couponAmount}
            </span>
          )}
        </div>
      </div>

      {/* Right section */}
      {hasItems ? (
        <button
          onClick={onCheckout}
          style={{
            backgroundColor: 'var(--brand-yellow)',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 20px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          去结算
        </button>
      ) : (
        <button
          disabled
          style={{
            backgroundColor: '#e5e7eb',
            color: '#9ca3af',
            border: 'none',
            borderRadius: '9999px',
            padding: '10px 20px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'not-allowed',
            whiteSpace: 'nowrap',
          }}
        >
          去结算
        </button>
      )}
    </div>
  );
}
