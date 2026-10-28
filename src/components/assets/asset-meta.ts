import { Cloud, Database, Network, Server, AppWindow, type LucideIcon } from "lucide-react";
import type { Asset, AssetType } from "@/lib/store";

export const ASSET_TYPES: AssetType[] = ["Server", "Database", "Cloud", "Network", "Application"];
export const ENVIRONMENTS: Asset["environment"][] = ["Production", "Staging", "Development"];

export const ASSET_ICON: Record<AssetType, LucideIcon> = {
  Server: Server,
  Database: Database,
  Cloud: Cloud,
  Network: Network,
  Application: AppWindow,
};
