import Link from "next/link";

export function Brand() {
  return (
    <Link href="/dashboard" className="brand" aria-label="Cosmo home">
      <span className="brand-mark">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2 L13.2 10.8 L22 12 L13.2 13.2 L12 22 L10.8 13.2 L2 12 L10.8 10.8 Z"
            fill="currentColor"
          />
        </svg>
      </span>
      Cosmo
    </Link>
  );
}

export default Brand;
