import {
  HouseIcon,
  PackageIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    label: "Geral",
    items: [{ title: "Início", href: "/", icon: HouseIcon }],
  },
  {
    label: "Comercial",
    items: [
      { title: "Leads", href: "/leads", icon: UsersIcon },
      { title: "Vendas", href: "/sales", icon: ShoppingCartIcon },
    ],
  },
  {
    label: "Estoque",
    items: [
      { title: "Compras", href: "/purchases", icon: ShoppingBagIcon },
      { title: "Produtos", href: "/products", icon: PackageIcon },
    ],
  },
];
