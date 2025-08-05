"use client";

import { scan } from "react-scan/all-environments";
import { JSX, useEffect } from "react";

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: true,
      showToolbar: true,
    });
  }, []);

  return <></>;
}
