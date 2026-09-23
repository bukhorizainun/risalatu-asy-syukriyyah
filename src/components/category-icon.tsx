import {
  BookHeart,
  CalendarHeart,
  Droplets,
  Flower2,
  HandCoins,
  HandHeart,
  Heart,
  Landmark,
  Moon,
  Sparkles,
  Sun,
  Tent,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  droplets: Droplets,
  landmark: Landmark,
  moon: Moon,
  "hand-coins": HandCoins,
  tent: Tent,
  sparkles: Sparkles,
  sun: Sun,
  flower: Flower2,
  "hand-heart": HandHeart,
  users: Users,
  calendar: CalendarHeart,
  heart: Heart,
  book: BookHeart,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? BookHeart;
  return <Icon className={className} />;
}
