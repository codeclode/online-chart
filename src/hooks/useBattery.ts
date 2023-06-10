import { useEffect, useState } from "react";

export function useBattery(onChange: () => void) {
  const [level, setLevel] = useState<number>(0);
  const [charging, setCharging] = useState<boolean>(false);
  useEffect(() => {
    const nav: any = window.navigator;
    if (nav.getBattery) {
      nav.getBattery().then((e: any) => {
        setLevel(e.level * 100);
        setCharging(e.charging);
        e.onlevelchange = () => {
          setLevel(e.level * 100);
          onChange()
        };
        e.onchargingchange = () => {
          setCharging(e.charging);
          onChange()
        };
      });
    }
  }, []);
  return {
    level,
    charging,
  };
}
