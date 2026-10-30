"use client";

import { createContext, useContext, useMemo, useState } from "react";

type IntroState = { ready: boolean; setReady: (v: boolean) => void };

const IntroContext = createContext<IntroState>({ ready: true, setReady: () => {} });

/** Indica cuándo la pantalla de entrada terminó, para encadenar la animación del hero. */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const value = useMemo(() => ({ ready, setReady }), [ready]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
