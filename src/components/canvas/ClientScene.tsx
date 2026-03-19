"use client";

import dynamic from "next/dynamic";

// 実際のSceneコンポーネントをクライアントサイドのみでロードします
const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

export default function ClientScene() {
  return <Scene />;
}
