"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-transparent animate-pulse" />
  ),
});

interface Scene3DWrapperProps {
  className?: string;
}

export default function Scene3DWrapper({ className }: Scene3DWrapperProps) {
  return <Scene3D className={className} />;
}
