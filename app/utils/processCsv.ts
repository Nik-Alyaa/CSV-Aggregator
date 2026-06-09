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

    const comboMap = new Map<
      string,
      {
        product: string;
        codes: string[];
        qty: number;
      }
    >();

    console.log(Object.keys(rows[0]));
    console.log(first["Actual Voucher Expiry"]);

    group.forEach((row) => {
      const product = String(row.Product_Name ?? "").trim();
      const code = String(row["Voucher Code"] ?? "").trim();
      const qty = Number(row.Quantity || 1);

      if (!comboMap.has(product)) {
        comboMap.set(product, {
          product,
          codes: [],
          qty: 0,
        });
      }

      const item = comboMap.get(product)!;

      item.qty += qty;

      if (code) {
        item.codes.push(code);
      }
    });

    const combos = Array.from(comboMap.values());

    const itemListHTML = combos
      .map((c) => c.product)
      .join("<br><br>");

    const quantityListHTML = combos
      .map((c) => c.qty)
      .join("<br><br>");

    const voucherCodeListHTML = combos
      .map((c) => c.codes.join("; "))
      .join("<br><br>");

    const voucherListCombined = combos
      .flatMap((c) =>
        c.codes.map(
          (code) => `${c.product} – ${code}`
        )
      )
      .join("; ");

    return {
      Email: first["Email"],
      MobileNumber: first["Mobile_Number"],
      FirstName: first["Contact_Name"],
      ItemListHTML: itemListHTML,
      QuantityListHTML: quantityListHTML,
      VoucherCodeListHTML: voucherCodeListHTML,
      VoucherListCombined: voucherListCombined,
      ExpiryDate: first["Actual Voucher Expiry"],
      TotalVoucher: combos.length,
    };
  });
}