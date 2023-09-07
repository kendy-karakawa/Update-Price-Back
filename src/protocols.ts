export type UnverifiedData = {
  new_price: number | string;
  product_code: number | string;
};

export type VerifildData = {
  new_price: number | string;
  product_code: number | string;
  valid?: boolean;
  error?: string;
  name?: string;
  sales_price?: string;
  is_pack?: boolean
  packsAsPack?: Pack[];
  packs?: Pack[]
}

export type Pack = {
  id: BigInt
  pack_id: BigInt 
  product_id: BigInt
  qty: BigInt
}

export type DataWithValidField = {
  new_price: number;
  product_code: number;
  valid?: boolean;
  error?: string;
};
