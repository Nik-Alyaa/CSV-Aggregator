export interface OutputRow {
  Email: string;
  MobileNumber: string;
  FirstName: string;
  ItemListHTML: string;
  QuantityListHTML: string;
  VoucherCodeListHTML: string;
  VoucherListCombined: string;
  ExpiryDate: string;
  TotalVoucher: number;
}

export function processCsv(rows: any[]): OutputRow[] {
  const emailGroups = new Map<string, any[]>();

  rows.forEach((row) => {
    const email = row.Email?.trim();

    if (!email) return;

    if (!emailGroups.has(email)) {
      emailGroups.set(email, []);
    }

    emailGroups.get(email)!.push(row);
  });

  return Array.from(emailGroups.values()).map((group) => {
    const first = group[0];

    const comboMap = new Map<string, {
      product: string;
      code: string;
      qty: number;
    }>();

    group.forEach((row) => {
      const product = row.Product_Name?.trim() || "";
      const code = row.Voucher_Code?.trim() || "";
      const key = `${product}||${code}`;
      const qty = Number(row.Quantity || 1);

      if (!comboMap.has(key)) {
        comboMap.set(key, { product, code, qty: 0 });
      }

      comboMap.get(key)!.qty += qty;
    });

    const combos = Array.from(comboMap.values());

    const itemListHTML = combos
      .map((c) => c.product)
      .join("<br><br>");

    const quantityListHTML = combos
      .map((c) => c.qty)
      .join("<br><br>");

    const voucherCodeListHTML = combos
      .map((c) => c.code)
      .join("<br><br>");

    const voucherListCombined = combos
      .map((c) => `${c.product} – ${c.code}`)
      .join("; ");

    return {
      Email: first.Email,
      MobileNumber: first.Mobile_Number,
      FirstName: first.Contact_Name,
      ItemListHTML: itemListHTML,
      QuantityListHTML: quantityListHTML,
      VoucherCodeListHTML: voucherCodeListHTML,
      VoucherListCombined: voucherListCombined,
      ExpiryDate: first.Actual_Voucher_Expiry,
      TotalVoucher: combos.length,
    };
  });
}