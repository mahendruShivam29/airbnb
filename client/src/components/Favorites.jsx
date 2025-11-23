import React, { useEffect, useState, useCallback } from "react";
import api from "../api";

export default function Favorites({
  endpoint = "/favorites",
  onSelect,
  renderItem,
}) {
    console.log("FROM " + "In favorites");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(endpoint, { withCredentials: true });
      console.log(data);
      // Backend returns: list.map(f => f.property)
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        (err?.response?.data?.message) ||
        (err?.message) ||
        "Failed to load favorites."
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;
    (async () => {
      await fetchFavorites();
    })();
    return () => {
      active = false; // defensive flag if you extend this later
    };
  }, [fetchFavorites]);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-600">
        Loading favorites…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
        <button
          onClick={fetchFavorites}
          className="rounded-lg bg-black px-3 py-2 text-white hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-4 text-sm text-gray-700">
        <p className="mb-3">No favorites yet.</p>
        <button
          onClick={fetchFavorites}
          className="rounded-lg bg-black px-3 py-2 text-white hover:opacity-90"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={fetchFavorites}
          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
          title="Refresh"
        >
          Refresh
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, idx) => {
          const key = p?.id ?? p?.propertyId ?? p?._id ?? idx;
          const title = p?.name ?? p?.title ?? p?.slug ?? `Property #${p?.id ?? idx + 1}`;
          const img =
            p?.coverImage ||
            p?.image ||
            (Array.isArray(p?.photos) && p.photos[0]?.url) ||
            null;
          const location =
            p?.city && p?.country ? `${p.city}, ${p.country}` : p?.address || null;

          const content = renderItem ? (
            renderItem(p)
          ) : (
            <div className="flex flex-col overflow-hidden rounded-2xl border bg-white">
              {/* {img ? (
                <img
                  src={img}
                  alt={title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
                  No image
                </div>
              )} */}
              <div className="flex flex-1 flex-col gap-1 p-3">
                <div className="line-clamp-1 text-sm font-medium">{title}</div>
                {location && (
                  <div className="line-clamp-1 text-xs text-gray-600">
                    {location}
                  </div>
                )}
                {p?.price && (
                  <div className="text-xs text-gray-700">{p.price}</div>
                )}
                {/* Fallback debug toggle if schema varies */}
                {!p?.name && !p?.title && !p?.slug && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500">Details</summary>
                    <pre className="whitespace-pre-wrap break-words text-xs text-gray-600">
                      {JSON.stringify(p, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          );

          return (
            <li key={key}>
              {onSelect ? (
                <button
                  onClick={() => onSelect(p)}
                  className="block w-full text-left"
                >
                  {content}
                </button>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
