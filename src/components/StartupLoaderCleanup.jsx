import { useEffect } from "react";

export default function StartupLoaderCleanup() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("startup-loader")?.remove();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
