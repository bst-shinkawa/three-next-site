"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

export default function ClientScene() {
  const pathname = usePathname();
  
  // マジシャンセミナーのページではグローバルな背景シーンを表示しない
  if (pathname === "/magician-seminar") return null;

  return <Scene />;
}
