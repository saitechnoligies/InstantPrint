// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { FileText, Clock, RefreshCw } from "lucide-react";

// export default function HomePage() {
//   const navigate = useNavigate();

//   // 🔥 Dummy data (replace with API later)
//   const recentOrders = [
//     {
//       id: "1234",
//       status: "Ready",
//       pages: 10,
//       copies: 2,
//     },
//     {
//       id: "1233",
//       status: "Expired",
//       pages: 5,
//       copies: 1,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HERO SECTION */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
//           <h1 className="text-2xl sm:text-3xl font-bold mb-2">
//             Print your documents instantly
//           </h1>
//           <p className="text-sm sm:text-base opacity-90 mb-6">
//             Upload, customize, and get your prints in minutes.
//           </p>

//           <Button
//             onClick={() => navigate("/upload")}
//             className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl"
//           >
//             Upload File
//           </Button>
//         </div>

//         {/* QUICK ACTIONS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <Card className="cursor-pointer hover:shadow-lg transition" onClick={() => navigate("/upload")}>
//             <CardContent className="p-5 flex items-center gap-4">
//               <FileText className="text-blue-600" />
//               <div>
//                 <p className="font-semibold">New Print</p>
//                 <p className="text-xs text-gray-500">Start a new order</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="cursor-pointer hover:shadow-lg transition">
//             <CardContent className="p-5 flex items-center gap-4">
//               <Clock className="text-indigo-600" />
//               <div>
//                 <p className="font-semibold">My Orders</p>
//                 <p className="text-xs text-gray-500">View history</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="cursor-pointer hover:shadow-lg transition">
//             <CardContent className="p-5 flex items-center gap-4">
//               <RefreshCw className="text-green-600" />
//               <div>
//                 <p className="font-semibold">Reprint</p>
//                 <p className="text-xs text-gray-500">Quick reorder</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RECENT ORDERS */}
//         <div>
//           <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

//           <div className="space-y-3">
//             {recentOrders.map((order) => (
//               <Card key={order.id} className="hover:shadow-md transition">
//                 <CardContent className="p-4 flex justify-between items-center">
//                   <div>
//                     <p className="font-semibold">Order #{order.id}</p>
//                     <p className="text-xs text-gray-500">
//                       {order.pages} pages • {order.copies} copies
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span
//                       className={`text-xs px-3 py-1 rounded-full ${
//                         order.status === "Ready"
//                           ? "bg-green-100 text-green-600"
//                           : "bg-red-100 text-red-600"
//                       }`}
//                     >
//                       {order.status}
//                     </span>

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/payment/${order.id}`)}
//                     >
//                       View
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* STATUS ALERT */}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
//           <p className="text-sm text-yellow-700">
//             Your last order is ready for pickup. Use OTP to collect.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }


import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, RefreshCw } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const recentOrders = [
    { id: "1234", status: "Ready", pages: 10, copies: 2 },
    { id: "1233", status: "Expired", pages: 5, copies: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HERO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Print your documents instantly
          </h1>
          <p className="text-sm sm:text-base opacity-90 mb-6">
            Upload, customize, and get your prints in minutes.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl"
          >
            Upload File
          </button>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div
            onClick={() => navigate("/upload")}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex items-center gap-4"
          >
            <FileText className="text-blue-600" />
            <div>
              <p className="font-semibold">New Print</p>
              <p className="text-xs text-gray-500">Start a new order</p>
            </div>
          </div>

          <div className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex items-center gap-4">
            <Clock className="text-indigo-600" />
            <div>
              <p className="font-semibold">My Orders</p>
              <p className="text-xs text-gray-500">View history</p>
            </div>
          </div>

          <div className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex items-center gap-4">
            <RefreshCw className="text-green-600" />
            <div>
              <p className="font-semibold">Reprint</p>
              <p className="text-xs text-gray-500">Quick reorder</p>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">
                    {order.pages} pages • {order.copies} copies
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      order.status === "Ready"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>

                  <button
                    onClick={() => navigate(`/payment/${order.id}`)}
                    className="border border-gray-300 px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERT */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-700">
            Your last order is ready for pickup. Use OTP to collect.
          </p>
        </div>

      </div>
    </div>
  );
}
