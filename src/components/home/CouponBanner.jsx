import { useState, useEffect } from 'react';

export default function CouponBanner({ coupons = [] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!coupons.length) return null;

  return (
    <div
      className="px-4 py-2"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease-in',
      }}
    >
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  );
}

function CouponCard({ coupon }) {
  return (
    <div
      className="flex-shrink-0 flex items-stretch rounded-lg overflow-hidden"
      style={{
        width: '220px',
        height: '72px',
        backgroundColor: '#F5A623',
        boxShadow: '0 2px 8px rgba(245, 166, 35, 0.4)',
        position: 'relative',
      }}
    >
      {/* Left section: amount */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ width: '30%', flexShrink: 0 }}
      >
        <div className="flex items-baseline leading-none">
          <span
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#fff',
              lineHeight: 1,
            }}
          >
            ¥{coupon.amount}
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.85)',
            marginTop: '2px',
          }}
        >
          元
        </span>
      </div>

      {/* Dashed divider with notch cutouts */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {/* Top notch */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#fff',
          }}
        />
        {/* Bottom notch */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#fff',
          }}
        />
        {/* Dashed line */}
        <div
          style={{
            width: '1px',
            height: '100%',
            borderLeft: '1.5px dashed rgba(255,255,255,0.6)',
          }}
        />
      </div>

      {/* Right section: description */}
      <div
        className="flex flex-col justify-center px-3"
        style={{ flex: 1 }}
      >
        <p
          style={{
            fontSize: '12px',
            color: '#fff',
            lineHeight: '1.4',
            marginBottom: '4px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {coupon.desc}
        </p>
        <span
          style={{
            display: 'inline-block',
            fontSize: '10px',
            color: '#F5A623',
            backgroundColor: '#fff',
            borderRadius: '2px',
            padding: '1px 4px',
            fontWeight: '600',
            alignSelf: 'flex-start',
          }}
        >
          无门槛
        </span>
      </div>
    </div>
  );
}
