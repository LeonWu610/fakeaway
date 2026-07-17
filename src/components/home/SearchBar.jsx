export default function SearchBar({ value = '', onChange, onSubmit, onClear, inputRef }) {
  return (
    <form onSubmit={(event) => { event.preventDefault(); onSubmit?.() }} className="sticky top-[47px] z-40 bg-[var(--brand-yellow)] px-3 pb-2">
      <div className="flex h-9 w-full items-center rounded-full bg-white pl-3 pr-1 shadow-sm focus-within:ring-1 focus-within:ring-black/10">
        <svg viewBox="0 0 24 24" className="h-4 w-4 flex-none text-gray-700" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input ref={inputRef} value={value} onChange={(event) => onChange?.(event.target.value)} className="ml-2 min-w-0 flex-1 bg-transparent text-[13px] text-[#222] outline-none placeholder:text-gray-400" placeholder="搜索商家或商品" aria-label="搜索商家或商品" />
        {value && <button type="button" onClick={onClear} className="mr-1 grid h-6 w-6 place-items-center rounded-full bg-gray-100 text-[13px] text-gray-400" aria-label="清空搜索">×</button>}
        <button type="submit" className="rounded-full bg-[var(--brand-yellow)] px-4 py-1.5 text-xs font-bold text-[#2b2500]">搜索</button>
      </div>
    </form>
  )
}
