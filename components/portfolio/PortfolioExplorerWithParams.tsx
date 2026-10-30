"use client";

import { useSearchParams } from "next/navigation";
import { PortfolioExplorer } from "./PortfolioExplorer";

/** Lee ?especialidad= para abrir el portafolio ya filtrado (p. ej. desde una especialidad). */
export function PortfolioExplorerWithParams() {
  const params = useSearchParams();
  return <PortfolioExplorer initialFilter={params.get("especialidad")} />;
}
