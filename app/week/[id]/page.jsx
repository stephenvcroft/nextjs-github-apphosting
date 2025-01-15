"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { BookOpen, CalendarCheck, ChevronRight, House } from "lucide-react";

const Page = ({ params }) => {
  const week = params.id;
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const colRef = collection(db, "week", week, "sheet");
        const querySnapshot = await getDocs(colRef);

        console.log("Query Snapshot:", querySnapshot);

        if (querySnapshot.empty) {
          console.log("No documents found!");
        }

        const sheetData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSheets(sheetData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sheets: ", error);
        setLoading(false);
      }
    };

    fetchSheets();
  }, [week]);

  return (
    <div className="flex flex-col items-center">
      {/* BREADCRUMB */}
      <div className="w-full h-8 flex items-center px-1 border-b bg-gray-50 space-x-1 text-gray-400">
        <Link href="/">
          <House size={20} />
        </Link>
        <ChevronRight size={20} />
        <CalendarCheck size={20} className="text-black" />
      </div>
      {/* SHEETS */}
      <div className="mt-4 flex flex-col space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : sheets.length === 0 ? (
          <p>No sheets available for week {week}</p>
        ) : (
          sheets.map((sheet) => (
            <Link
              key={sheet.id}
              href={`/week/${week}/sheet/${sheet.id}`}
              className="px-3 py-1 flex items-center space-x-1 rounded-xl border font-medium text-sm shadow hover:underline"
            >
              <BookOpen size={16} />
              <span>{`week/${week}/sheet/${sheet.id}`}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
