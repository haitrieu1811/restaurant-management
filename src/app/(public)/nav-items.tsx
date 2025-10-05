"use client";

import { getAccessTokenFromLS } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    setIsAuthenticated(!!getAccessTokenFromLS());
  }, []);

  return menuItems.map((item) => {
    if (
      (item.authRequired === true && !isAuthenticated) ||
      (item.authRequired === false && isAuthenticated)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
