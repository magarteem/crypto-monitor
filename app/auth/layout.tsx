"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GoBack } from "@features/goBack";
import styles from "./layout.module.scss";
import { RouteNames } from "../shared/types";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Параллакс эффект
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  // Редирект на главную, если пользователь уже авторизован
  useEffect(() => {
    if (status === "authenticated") {

      if (pathname === RouteNames.AUTH_REGISTRATION) {
        router.push(RouteNames.TARIFFS);
        return
      }
      router.push(RouteNames.HOME);
    }
  }, [status, router]);


  return (
    <div className={styles.page} onMouseMove={handleMouseMove}>
      <div className={styles.bgBase} aria-hidden />
      <div className={`${styles.grid3dWave} grid-3d-wave`} aria-hidden />
      <GoBack />
      <main
        className={styles.main}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.2s ease-out",
        }}
      >

        {children}
      </main>
    </div>
  );
}
