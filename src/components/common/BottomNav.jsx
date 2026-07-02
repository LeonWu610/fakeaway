import React from 'react';

const tabs = [
  { key: 'home', label: '首页', emoji: '🏠' },
  { key: 'coupon', label: '神券', emoji: '🎫' },
  { key: 'order', label: '订单', emoji: '📋' },
  { key: 'profile', label: '我的', emoji: '👤' },
];

const MEITUAN_YELLOW = '#F5A623';
const GRAY = '#999999';

export default function BottomNav({ activeTab = 'home' }) {
  const handleTabClick = (tab) => {
    if (tab.key !== 'home') {
      alert('该功能暂未开放');
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 1000,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const color = isActive ? MEITUAN_YELLOW : GRAY;

        return (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              color: color,
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{tab.emoji}</span>
            <span style={{ fontSize: '11px', fontWeight: isActive ? '600' : '400' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
