"use client";
import { db } from "@/firebase/config";
import { doc, writeBatch } from "firebase/firestore";
import showToast from "@/utils/showToast";
import { useState } from "react";

import { FirestoreProductSchema } from "./FirestoreProductSchema";
import Link from "next/link";
import { ChevronRight, ExternalLink, Grid2x2Plus, House } from "lucide-react";

const Page = () => {
  // Needs to be in this file for some reason???
  const LayoutPreviews = {
    TL: [
      "top-2 left-2 w-40 h-40",
      "top-0 left-48 w-20 h-20",
      "top-24 left-48 w-20 h-20",
      "top-48 left-0 w-20 h-20",
      "top-48 left-24 w-20 h-20",
      "top-48 left-48 w-20 h-20",
    ],
    TR: [
      "top-0 left-0 w-20 h-20",
      "top-24 left-0 w-20 h-20",
      "top-2 left-24 w-40 h-40",
      "top-48 left-0 w-20 h-20",
      "top-48 left-24 w-20 h-20",
      "top-48 left-48 w-20 h-20",
    ],
  };

  // State
  const [week, setWeek] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [layout, setLayout] = useState("TL");
  const [products, setProducts] = useState([]);

  // UI State
  const [link01, setLink01] = useState("bg-gray-400");
  const [link02, setLink02] = useState("bg-gray-400");
  const [link03, setLink03] = useState("bg-gray-400");
  const [link04, setLink04] = useState("bg-gray-400");
  const [link05, setLink05] = useState("bg-gray-400");

  // Add To Database
  const addToDatabase = async () => {
    try {
      const batch = writeBatch(db);

      // dummy week & sheets field (FIX for unknown bug)
      const weekDocRef = doc(db, "week", week);
      batch.set(weekDocRef, { dummy: "" });
      const sheetsDocRef = doc(db, "week", week, "sheet", sheet);
      batch.set(sheetsDocRef, { dummy: "" });

      FirestoreProductSchema[layout].forEach((schema, index) => {
        const product = products[index];

        const updatedProduct = {
          ...schema,
          ...product,
        };

        const docRef = doc(
          db,
          "week",
          week,
          "sheet",
          sheet,
          "products",
          String(index + 1)
        );
        batch.set(docRef, updatedProduct);
      });

      await batch.commit();
      showToast("success", "Products successfully added!");
      sheet === "01" && setLink01("bg-blue-400");
      sheet === "02" && setLink02("bg-blue-400");
      sheet === "03" && setLink03("bg-blue-400");
      sheet === "04" && setLink04("bg-blue-400");
      sheet === "05" && setLink05("bg-blue-400");
    } catch (error) {
      console.error("Error adding products to Firestore:", error);
      showToast("error", "Failed to add products.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* BREADCRUMB */}
      <div className="w-full h-8 flex items-center px-1 border-b bg-gray-50 space-x-1 text-gray-400">
        <Link href="/">
          <House size={20} />
        </Link>
        <ChevronRight size={20} />
        <Grid2x2Plus size={20} className="text-black" />
      </div>

      {/* OPTIONS */}
      <div className="mt-4 flex justify-center space-x-4">
        {/* Week */}
        <div className="w-36 max-h-96 overflow-y-scroll flex flex-col space-y-2 rounded border shadow">
          {Array.from({ length: 52 }).map((_, index) => (
            <button
              key={index + 1}
              className={`text-sm ${
                week === String(index + 1).padStart(2, "0") &&
                "bg-blue-500 text-white"
              } hover:scale-105`}
              onClick={() => setWeek(String(index + 1).padStart(2, "0"))}
            >
              week/{String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        {/* Sheet */}
        <div className="w-32 h-96 flex flex-col justify-center space-y-2 rounded border shadow">
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index + 1}
              className={`text-sm ${
                sheet === String(index + 1).padStart(2, "0") &&
                "bg-blue-500 text-white"
              }`}
              onClick={() => setSheet(String(index + 1).padStart(2, "0"))}
            >
              sheet/{String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        {/* Layout */}
        <div className="w-32 h-96 flex flex-col justify-center space-y-2 rounded border shadow">
          <button
            className={`text-sm ${layout === "TL" && "bg-blue-500 text-white"}`}
            onClick={() => setLayout("TL")}
          >
            Top Left
          </button>
          <button
            className={`text-sm ${layout === "TR" && "bg-blue-500 text-white"}`}
            onClick={() => setLayout("TR")}
          >
            Top Right
          </button>
        </div>
        {/* Selected Images */}
        <div className="relative flex w-72 h-80">
          <div
            className={`absolute ${LayoutPreviews[layout][0]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[0]
                  ? "/week-01/" + products[0].image_src
                  : "/dummy/1.png"
              }
              alt=""
            />
          </div>
          <div
            className={`absolute ${LayoutPreviews[layout][1]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[1]
                  ? "/images/" + products[1].image_src
                  : "/dummy/2.png"
              }
              alt=""
            />
          </div>
          <div
            className={`absolute ${LayoutPreviews[layout][2]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[2]
                  ? "/images/" + products[2].image_src
                  : "/dummy/3.png"
              }
              alt=""
            />
          </div>
          <div
            className={`absolute ${LayoutPreviews[layout][3]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[3]
                  ? "/images/" + products[3].image_src
                  : "/dummy/4.png"
              }
              alt=""
            />
          </div>
          <div
            className={`absolute ${LayoutPreviews[layout][4]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[4]
                  ? "/images/" + products[4].image_src
                  : "/dummy/5.png"
              }
              alt=""
            />
          </div>
          <div
            className={`absolute ${LayoutPreviews[layout][5]} flex justify-center items-center rounded-xl border`}
          >
            <img
              src={
                products[5]
                  ? "/images/" + products[5].image_src
                  : "/dummy/6.png"
              }
              alt=""
            />
          </div>
        </div>
        {/* ADD BUTTON */}
        <div className="flex flex-col justify-center space-y-2">
          <button
            className={`w-48 py-1 rounded font-medium text-white opacity-80 hover:opacity-100 ${
              week === null || sheet === null ? "bg-gray-500" : "bg-green-500"
            }`}
            disabled={week === null || sheet === null}
            onClick={addToDatabase}
          >
            ADD TO DB
          </button>
          <Link
            href={`/week/${week}/sheet/01`}
            target="_blank"
            className={`flex justify-center items-center w-48 py-1 space-x-1 rounded font-medium text-white hover:underline ${link01}`}
          >
            <span>week/{week || "?"}/sheet/01</span>
            <ExternalLink size={16} />
          </Link>
          <Link
            href={`/week/${week}/sheet/02`}
            target="_blank"
            className={`flex justify-center items-center w-48 py-1 space-x-1 rounded font-medium text-white hover:underline ${link02}`}
          >
            <span>week/{week || "?"}/sheet/02</span>
            <ExternalLink size={16} />
          </Link>
          <Link
            href={`/week/${week}/sheet/03`}
            target="_blank"
            className={`flex justify-center items-center w-48 py-1 space-x-1 rounded font-medium text-white hover:underline ${link03}`}
          >
            <span>week/{week || "?"}/sheet/03</span>
            <ExternalLink size={16} />
          </Link>
          <Link
            href={`/week/${week}/sheet/04`}
            target="_blank"
            className={`flex justify-center items-center w-48 py-1 space-x-1 rounded font-medium text-white hover:underline ${link04}`}
          >
            <span>week/{week || "?"}/sheet/04</span>
            <ExternalLink size={16} />
          </Link>
          <Link
            href={`/week/${week}/sheet/05`}
            target="_blank"
            className={`flex justify-center items-center w-48 py-1 space-x-1 rounded font-medium text-white hover:underline ${link05}`}
          >
            <span>week/{week || "?"}/sheet/05</span>
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
