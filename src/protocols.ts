export type UnverifiedData = {
  new_price: number | string;
  product_code: number | string;
};

export type VerifildData = {
  new_price: number | string;
  product_code: number | string;
  valid?: boolean;
  error?: string;
}

export type DataWithValidField = {
  new_price: number;
  product_code: number;
  valid?: boolean;
  error?: string;
};
