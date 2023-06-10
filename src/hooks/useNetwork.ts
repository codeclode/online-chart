import { useEffect, useState } from "react";

function getLevel() {
  const nav: any = window.navigator;
  const connect = nav.connection;
  const lev = parseInt(connect.effectiveType);
  return isNaN(lev) ? 1 : lev;
}

export function useNetwork(onChange: () => void) {
  const [level, setLevel] = useState<number>(3);
  const [inLine, setInLine] = useState<boolean>(false);
  useEffect(() => {
    const nav: any = window.navigator;
    const connect = nav.connection;
    setLevel(getLevel());
    setInLine(navigator.onLine);
    window.ononline = () => {
      setInLine(true);
      setLevel(getLevel());
      onChange();
    };
    window.onoffline = () => {
      setInLine(false);
      setLevel(0);
      onChange();
    };
    connect.addEventListener("change", () => {
      setLevel(getLevel());
      onChange();
    });
  }, []);
  return { inLine, level };
}
