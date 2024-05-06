import {
  User,
  Company,
  Warehouse,
  ReceivedItem,
  ReceivingNote,
  Item,
  Invoice,
  InvoiceItem,
  Purchase,
  PurchaseItem,
  PermissionModels,
  Role,
  PermissionEnum
} from "@prisma/client";

export type Page = {
  name: String;
  href: String;
};

export type UserWithCompany = Omit<
  User,
  "company_id" | "created_at" | "updated_at" | "emailVerified" | "password"
> & {
  company: Omit<Company, "created_at" | "updated_at">;
};

export type UserType = Omit<User, "created_at" | "updated_at" | "emailVerified" | "password"> & {
  role?: Role;
  created_at: String;
  updated_at: String;
};


export type InvoiceType = Omit<Invoice, "created_at" | "updated_at"> & {
  items: InvoiceItemsType[];
  created_at: String;
  updated_at: String;
};


export type ItemType = Omit<Item, "created_at" | "updated_at"> & {
  created_at: String;
  updated_at: String;
};


export type InvoiceItemsType = Omit<InvoiceItem, "created_at"> & {
  
  items: ItemType[];
  created_at: String;
};

export type InvoiceItemForm = { id?: string; invoice_id?: string; inventory_id: string; quantity: number; selling_price: number };

export type WarehouseType = Omit<
  Warehouse,
  "created_at" | "updated_at" | "company_id"
> & {
  created_at: String;
  updated_at: String;
};

export type CompanyType = Omit<Company, "created_at" | "updated_at"> & {
  warehouses: WarehouseType[];
  created_at: String;
  updated_at: String;
};

export type ReceivedItemType = Omit<
  ReceivedItem,
  "created_at" | "updated_at" | "warehouse_id"
> & {
  created_at: String;
  updated_at: String;
};

export type ReceivingNoteType = Omit<
  ReceivingNote,
  "created_at" | "updated_at" | "warehouse_id"
> & {
  items: ReceivedItemType[];
  created_at: String;
  updated_at: String;
};

export type PurchaseType = Omit<Purchase, "created_at" | "updated_at"> & {
  items: PurchaseItemType[];
  created_at: String;
  updated_at: String;
};

export type PurchaseItemType = Omit<
  PurchaseItem,
  "created_at" | "updated_at" | "purchase_id"
> & {
  created_at: String;
  updated_at: String;
};

export type ReportType = {
  items: {
    name: string;
    quantity: number;
    price: number;
    profit_margin: number;
  }[];
  total_quantity: number;
  total_price: number;
  total_profit_margin: number;
};


export type RoleType = Omit<
Role,
"created_at" | "updated_at" | "purchase_id"
> & {
  created_at: String;
  updated_at: String;
};

export type PermissionModelsType = Omit<
PermissionModels,
"created_at" | "updated_at" | "role_id"
> & {
  created_at: String;
  updated_at: String;
};

export type PermissionModelsForm = { id?: string; model: string; permission?: PermissionEnum[] };


