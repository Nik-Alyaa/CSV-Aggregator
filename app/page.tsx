"use client";

import { useState } from "react";
import Papa from "papaparse";
import { processCsv } from "../app/utils/processCsv";

export default function Home() {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [outputData, setOutputData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transformed = processCsv(
          results.data as any[]
        );

        setOutputData(transformed);
        setPreviewData(transformed.slice(0, 20));
        setLoading(false);
      },
      error: () => {
        alert("Failed to read CSV");
        setLoading(false);
      },
    });
  };

  const downloadCsv = () => {
    if (!outputData.length) return;

    const csv = Papa.unparse(outputData);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_vouchers.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-green-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-xl">
          
          {/* Header */}
          <div className="bg-green-700 px-8 py-6 text-white">
            <h1 className="text-4xl font-bold">
              ABB Voucher Consolidator
            </h1>

            <p className="mt-2 text-green-100">
              Upload CSV → Consolidate Records →
              Download Result
            </p>
          </div>

          <div className="p-8">

            {/* Upload Section */}
            <div className="rounded-xl border-2 border-dashed border-green-300 bg-green-50 p-8">
              <label className="block cursor-pointer">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-800">
                    Upload CSV File
                  </p>

                  <p className="mt-2 text-sm text-green-600">
                    Select your voucher export file
                  </p>
                </div>

                <input
                  type="file"
                  accept=".csv"
                  onChange={handleUpload}
                  className="mt-4 block w-full rounded-lg border border-green-300 bg-white p-3"
                />
              </label>
            </div>

            {loading && (
              <div className="mt-6 rounded-lg bg-green-100 p-4">
                <p className="font-medium text-green-800">
                  Processing CSV...
                </p>
              </div>
            )}

            {!!outputData.length && (
              <>
                {/* Stats */}
                <div className="mt-8 flex flex-wrap items-center gap-4">

                  <div className="rounded-lg border border-green-300 bg-green-100 px-5 py-3">
                    <div className="text-xs uppercase text-green-700">
                      Total Emails
                    </div>

                    <div className="text-2xl font-bold text-green-900">
                      {outputData.length}
                    </div>
                  </div>

                  <button
                    onClick={downloadCsv}
                    className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                  >
                    Generate & Download CSV
                  </button>
                </div>

                {/* Preview Table */}
                <div className="mt-8 overflow-hidden rounded-xl border border-green-200 shadow-sm">
                  <div className="bg-green-700 px-4 py-3 text-white">
                    <h2 className="font-semibold">
                      Preview Results
                    </h2>
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-green-100 text-green-900">
                          <th className="p-4 text-left font-semibold">
                            Email
                          </th>

                          <th className="p-4 text-left font-semibold">
                            First Name
                          </th>

                          <th className="p-4 text-left font-semibold">
                            Mobile
                          </th>

                          <th className="p-4 text-left font-semibold">
                            Total Voucher
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {previewData.map((row, index) => (
                          <tr
                            key={index}
                            className={`border-t border-green-100 ${
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-green-50"
                            }`}
                          >
                            <td className="p-4 text-green-900">
                              {row.Email}
                            </td>

                            <td className="p-4 text-green-900">
                              {row.FirstName}
                            </td>

                            <td className="p-4 text-green-900">
                              {row.MobileNumber}
                            </td>

                            <td className="p-4 font-medium text-green-900">
                              {row.TotalVoucher}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="mt-4 text-sm text-green-700">
                  Showing first 20 records
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}