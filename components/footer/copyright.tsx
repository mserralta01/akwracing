"use client";

import { useEffect, useState } from "react";

export function Copyright() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="text-gray-400">
      © {year} AKW Racing Academy. All rights reserved.
    </div>
  );
}