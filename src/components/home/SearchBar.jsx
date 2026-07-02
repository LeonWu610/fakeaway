import React from 'react';

const MEITUAN_YELLOW = '#F5A623';

export default function SearchBar() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid #e0e0e0',
          borderRadius: '20px',
          padding: '6px 12px',
          backgroundColor: '#f7f7f7',
        }}
      >
        <span style={{ fontSize: '16px', color: '#999999' }}>🔍</span>
        <span style={{ fontSize: '14px', color: '#aaaaaa', userSelect: 'none' }}>
          搜索餐厅或菜品
        </span>
      </div>
      <button
        style={{
          backgroundColor: MEITUAN_YELLOW,
          color: '#ffffff',
          border: 'none',
          borderRadius: '20px',
          padding: '7px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        搜索
      </button>
    </div>
  );
}
