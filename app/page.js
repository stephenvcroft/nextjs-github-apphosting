import { Calendar, House } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex flex-col items-center">
      {/* BREADCRUMB */}
      <div className="w-full h-8 flex items-center px-1 border-b bg-gray-50">
        <House size={20} />
      </div>
      {/* CREATE */}
      <Link
        href="create"
        className="mt-4 px-4 py-1 flex justify-center rounded-xl font-medium text-sm bg-blue-500 text-white opacity-80 hover:opacity-100"
      >
        Create
      </Link>
      {/* WEEKS */}
      <div className="mt-2 w-96 flex justify-center flex-wrap">
        {Array.from({ length: 52 }).map((_, index) => {
          const week = String(index + 1).padStart(2, "0");
          return (
            <Link
              key={week}
              href={`/week/${week}`}
              className="m-2 px-3 py-1 flex items-center space-x-1 rounded-xl border font-medium text-sm shadow hover:underline"
            >
              <Calendar size={16} />
              <span>week/{week}</span>
            </Link>
          );
        })}
      </div>
      {/* TEST SERVER ACTION */}
      <Link
        href="test-server-action"
        className="mt-4 px-4 py-1 flex justify-center rounded-xl font-medium text-sm bg-blue-500 text-white opacity-80 hover:opacity-100"
      >
        app/test-server-action
      </Link>
    </div>
  );
};

export default Page;
