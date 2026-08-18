import { useEffect, useRef, useState } from "react";
import { COUNTRY_CODES } from "@/shared/constants/countryCodes";

/**
 * Searchable dropdown for picking a country's dial code (e.g. 🇮🇳 India +91).
 * Renders as a compact button that opens a filterable list — meant to sit
 * directly to the left of a phone number input.
 *
 * Props:
 *  - value: the currently selected dial code string, e.g. "+91"
 *  - onChange: (dialCode: string) => void
 *  - name: form field name, used for a hidden input so plain <form> FormData submissions still work
 */
const CountryCodeSelect = ({ value, onChange, name = "countryCode" }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  const selected =
    COUNTRY_CODES.find((c) => c.dialCode === value) || COUNTRY_CODES[0];

  const filtered = COUNTRY_CODES.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.iso2.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onChange?.(code.dialCode);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="position-relative" ref={wrapperRef} style={{ minWidth: 110 }}>
      <input type="hidden" name={name} value={selected.dialCode} readOnly />

      <button
        type="button"
        className="btn bg-light border-0 d-flex align-items-center gap-1 py-2 px-2 rounded-3 w-100"
        onClick={() => setOpen((o) => !o)}
        style={{ fontSize: "0.9rem" }}
      >
        <span>{selected.flag}</span>
        <span className="fw-bold">{selected.dialCode}</span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} ms-auto small`}></i>
      </button>

      {open && (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 border mt-1"
          style={{ zIndex: 1050, width: 260, maxHeight: 280, overflowY: "auto" }}
        >
          <div className="p-2 border-bottom">
            <input
              autoFocus
              type="text"
              className="form-control form-control-sm"
              placeholder="Search country or code..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="list-unstyled mb-0">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-muted small">No matches</li>
            )}
            {filtered.map((c) => (
              <li
                key={c.iso2}
                className="px-3 py-2 d-flex align-items-center gap-2 country-option"
                style={{
                  cursor: "pointer",
                  background: c.dialCode === selected.dialCode ? "#f8fafc" : "transparent",
                }}
                onMouseDown={() => handleSelect(c)}
                onMouseOver={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    c.dialCode === selected.dialCode ? "#f8fafc" : "transparent")
                }
              >
                <span>{c.flag}</span>
                <span className="small flex-grow-1">{c.name}</span>
                <span className="small text-muted fw-bold">{c.dialCode}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect;
