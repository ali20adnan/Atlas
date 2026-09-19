export type ItemStatus =
  | 'in_stock'
  | 'low_stock'
  | 'reserved'
  | 'in_transit'
  | 'checked_out'
  | 'damaged'
  | 'expired';

export type ItemCondition = 'new' | 'good' | 'used' | 'sealed';

export type Movement = {
  id: string;
  at: string;
  typeEn: string;
  typeAr: string;
  by: string;
  qtyDelta: number;
};

export type WarehouseItem = {
  id: string;
  sku: string;
  barcode: string;
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  qty: number;
  minQty: number;
  unitEn: string;
  unitAr: string;
  aisle: string;
  rack: string;
  bin: string;
  status: ItemStatus;
  condition: ItemCondition;
  supplierEn: string;
  supplierAr: string;
  batch: string;
  expiry?: string;
  lastMovementAt: string;
  history: Movement[];
};

export type UserRole = 'supervisor' | 'operator';

export type SessionUser = {
  username: string;
  displayEn: string;
  displayAr: string;
  role: UserRole;
};
