import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Spinner from "@/components/ui/Spinner";

function SortSelect() {
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") ?? "relevance";

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    params.set("sort", e.target.value);
    params.set("page", "1");
    setParams(params, { replace: true });
  };

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sort</span>
      <select
        value={sort}
        onChange={onChange}
        className="rounded-md border px-2 py-1 text-sm"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price ↑</option>
        <option value="price_desc">Price ↓</option>
        <option value="newest">Newest</option>
      </select>
    </label>
  );
}

function PriceFilter() {
  const [params, setParams] = useSearchParams();
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");
  const [applying, setApplying] = useState(false);

  const apply = () => {
    setApplying(true);
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    params.set("page", "1");
    setParams(params, { replace: true });
    setTimeout(() => setApplying(false), 150);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Price</span>
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="w-24 rounded-md border px-2 py-1 text-sm"
      />
      <span>—</span>
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="w-24 rounded-md border px-2 py-1 text-sm"
      />
      <button
        type="button"
        onClick={apply}
        disabled={applying}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {applying && <Spinner />}
        Apply
      </button>
    </div>
  );
}

export default function FilterBar({ total }: { total: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-gray-600">{total} result(s)</div>
      <div className="flex items-center gap-4">
        <PriceFilter />
        <SortSelect />
      </div>
    </div>
  );
}