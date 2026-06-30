// "use client";
// import { Ban,Truck,Store,Handshake,ChartLine,Settings,Dock ,User} from "lucide-react";
// import { useState } from "react";

// type NavChild = {
//   label: string;
//   href: string;
//   badge?: string;
// };

// type NavItem = {
//   label: string;
//   icon: any;
//   href: string;
//   badge?: string;
//   children?: NavChild[];
// };



// const navItems: NavItem[] = [
//   { label: "Overview", icon: <Dock/>, href: "/admin" },
//   {
//     label: "Products",
//     icon: <Store/>,
//     href: "/admin/products",
//     badge: "42",
//     children: [
//       { label: "All Products", href: "/admin/products", badge: "42" },
//       { label: "Add Product", href: "/admin/products/add" },
//       { label: "Featured Products", href: "/admin/products/featured", badge: "8" },
//       { label: "Low Stock", href: "/admin/products/low-stock", badge: "5" },
//     ],
//   },
//   {
//     label: "Orders",
//     icon: <Truck/>,
//     href: "/admin/orders",
//     badge: "12",
//     children: [
//       { label: "All Orders", href: "/admin/orders", badge: "312" },
//       { label: "Pending Orders", href: "/admin/orders/pending", badge: "12" },
//       { label: "Delivered Orders", href: "/admin/orders/delivered", badge: "248" },
//       { label: "Cancelled Orders", href: "/admin/orders/cancelled", badge: "9" },
//       { label: "Returned Orders", href: "/admin/orders/returned", badge: "4" },
//     ],
//   },
//   { label: "Customers", icon: <User/>, href: "/admin/customers" },
//   {
//     label: "Staff",
//     icon: <Handshake/>,
//     href: "/admin/staff",
//     children: [
//       { label: "All Staff", href: "/admin/staff" },
//       { label: "Roles", href: "/admin/staff/roles" },
//       { label: "Permissions", href: "/admin/staff/permissions" },
//     ],
//   },
//   { label: "Analytics", icon: <ChartLine/>, href: "/admin/analytics" },
//   { label: "Settings", icon: <Settings/>, href: "/admin/settings" },
// ];

// const stats = [
//   { label: "Revenue", value: "₹84.2k", change: "+18%" },
//   { label: "Orders", value: "312", change: "+9%" },
//   { label: "Products", value: "42", change: "+6" },
// ];

// export default function AdminSidebarLayout() {
//   const getBreadcrumbs = (activeLabel: string) => {
//     for (const item of navItems) {
//       if (item.label === activeLabel) {
//         return ["Admin", item.label];
//       }

//       const child = item.children?.find((childItem) => childItem.label === activeLabel);

//       if (child) {
//         return ["Admin", item.label, child.label];
//       }
//     }

//     return ["Admin", activeLabel];
//   };

//   const [collapsed, setCollapsed] = useState(false);
//   const [active, setActive] = useState("Overview");
//   const [openMenus, setOpenMenus] = useState<string[]>(["Products", "Orders"]);
//   const [userMenuOpen, setUserMenuOpen] = useState<"sidebar" | "navbar" | null>(null);
//   const [quickAddOpen, setQuickAddOpen] = useState(false);
//   const breadcrumbs = getBreadcrumbs(active);

//   const toggleMenu = (label: string) => {
//     setOpenMenus((prev) =>
//       prev.includes(label)
//         ? prev.filter((item) => item !== label)
//         : [...prev, label]
//     );
//   };

//   const handleNavClick = (item: NavItem) => {
//     const hasChildren = Boolean(item.children?.length);

//     // If sidebar is closed, clicking any icon should open it first.
//     if (collapsed) {
//       setCollapsed(false);

//       if (hasChildren) {
//         setOpenMenus((prev) =>
//           prev.includes(item.label) ? prev : [...prev, item.label]
//         );
//       } else {
//         setActive(item.label);
//       }

//       return;
//     }

//     if (hasChildren) {
//       toggleMenu(item.label);
//       return;
//     }

//     setActive(item.label);
//   };

//   return (
//     <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
//       <div className="flex min-h-screen ">
//         {/* SIDEBAR */}
//         <aside
//           className={` fixed inset-y-0 left-0 z-40 hidden border-r border-white/70  shadow-xl shadow-zinc-900/5 backdrop-blur-2xl transition-all duration-300 lg:block ${
//             collapsed ? "w-20" : "w-68"
//           }`}
//         >
//           <div className="flex  h-full flex-col p-2">
//             {/* Brand */}
//             <div className="mb-6 flex items-center justify-between gap-3 rounded-3xl bg-zinc-950 p-2.5 text-white">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-zinc-950">
//                   V
//                 </div>
//                 {!collapsed ? (
//                   <div>
//                     <p className="text-sm font-semibold">VetriGlass</p>
//                     <p className="text-xs text-zinc-400">Admin Panel</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>

//             {/* Collapse Button */}
//             <button
//               type="button"
//               onClick={() => setCollapsed((prev) => !prev)}
//               className="mb-5 flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-2 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
//             >
//               {collapsed ? "→" : "← Hide Sidebar"}
//             </button>

//             {/* Navigation */}
//             <nav className="space-y-2 overflow-y-auto pr-1">
//               {navItems.map((item) => {
//                 const hasChildren = Boolean(item.children?.length);
//                 const isOpen = openMenus.includes(item.label);
//                 const isActive = active === item.label || item.children?.some((child) => child.label === active);

//                 return (
//                   <div key={item.label}>
//                     <button
//                       type="button"
//                       onClick={() => handleNavClick(item)}
//                       className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm font-semibold transition ${
//                         isActive
//                           ? "bg-zinc-950 text-white shadow-lg shadow-zinc-950/15"
//                           : "text-zinc-600 hover:bg-white hover:text-zinc-950"
//                       }`}
//                     >
//                       <span
//                         className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base ${
//                           isActive ? "bg-white/15" : "bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white"
//                         }`}
//                       >
//                         {item.icon}
//                       </span>

//                       {!collapsed ? (
//                         <>
//                           <span className="flex-1">{item.label}</span>
//                           {item.badge ? (
//                             <span
//                               className={`rounded-full px-2 py-0.5 text-xs ${
//                                 isActive ? "bg-white/15 text-white" : "bg-zinc-100 text-zinc-600"
//                               }`}
//                             >
//                               {item.badge}
//                             </span>
//                           ) : null}
//                           {hasChildren ? (
//                             <span className={`text-xs transition ${isOpen ? "rotate-90" : ""}`}>
//                               ›
//                             </span>
//                           ) : null}
//                         </>
//                       ) : null}
//                     </button>

//                     {!collapsed && hasChildren && isOpen ? (
//                       <div className="ml-7 mt-2 space-y-1 border-l border-zinc-200 pl-4">
//                         {item.children?.map((child) => {
//                           const childActive = active === child.label;

//                           return (
//                             <button
//                               key={child.label}
//                               type="button"
//                               onClick={() => setActive(child.label)}
//                               className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
//                                 childActive
//                                   ? "bg-zinc-100 font-semibold text-zinc-950"
//                                   : "text-zinc-500 hover:bg-white hover:text-zinc-950"
//                               }`}
//                             >
//                               <span className="h-1.5 w-1.5 rounded-full bg-current" />
//                               <span className="flex-1">{child.label}</span>
//                               {child.badge ? (
//                                 <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
//                                   {child.badge}
//                                 </span>
//                               ) : null}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     ) : null}
//                   </div>
//                 );
//               })}
//             </nav>

//             {/* Bottom User Card */}
//             <div className="relative mt-auto">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setUserMenuOpen((prev) => (prev === "sidebar" ? null : "sidebar"))
//                 }
//                 className="w-full rounded-full border border-zinc-200 bg-white px-3 py-3 text-left shadow-sm transition hover:bg-zinc-50"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
//                     K
//                     <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
//                   </div>
//                   {!collapsed ? (
//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-semibold">Karan Admin</p>
//                       <p className="text-xs text-emerald-600">Online</p>
//                     </div>
//                   ) : null}
//                 </div>
//               </button>

//               {userMenuOpen === "sidebar" ? (
//                 <div
//                   className={`absolute bottom-full mb-3 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10 ${
//                     collapsed ? "left-0 w-48" : "left-0 right-0"
//                   }`}
//                 >
//                   <button
//                     type="button"
//                     className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     type="button"
//                     className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
//                     onClick={() => alert("Logout clicked")}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </aside>

//         {/* CONTENT AREA */}
//         <section
//           className={`flex min-h-screen  flex-1 flex-col transition-all duration-300 ${
//             collapsed ? "lg:pl-20" : "lg:pl-68"
//           }`}
//         >
//           {/* NAVBAR */}
//           <header className="sticky w-full  top-0 z-50 overflow-visible border-b border-white/70 px-2 py-2 shadow-sm backdrop-blur-2xl sm:px-6">
//             <div className="mx-auto flex max-w-7xl items-center gap-4">


//               <div className="relative z-50 flex flex-1 flex-wrap items-center gap-3 rounded-[1.75rem] border border-zinc-200 bg-white px-4 py-1 shadow-sm overflow-visible">
//                 <div className="flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
//                   <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                   Store Live
//                 </div>

//                 <button
//                   type="button"
//                   onClick={() => setActive("Pending Orders")}
//                   className="shrink-0 rounded-full bg-amber-50 px-4 py- text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
//                 >
//                   12 Pending Orders
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setActive("Low Stock")}
//                   className="shrink-0 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
//                 >
//                   5 Low Stock
//                 </button>

//                 <div className="relative z-[999] shrink-0">
//                   <button
//                     type="button"
//                     onClick={() => setQuickAddOpen((prev) => !prev)}
//                     className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
//                   >
//                     + Quick Add
//                   </button>

//                   {quickAddOpen ? (
//                     <div className="absolute right-0 top-[calc(100%+0.75rem)] z-[9999] w-64 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/20">
//                       {[
//                         "Add Product",
//                         "Add Category",
//                         "Add Staff",
//                         "Create Discount",
//                         "Export Orders",
//                       ].map((action) => (
//                         <button
//                           key={action}
//                           type="button"
//                           onClick={() => {
//                             setActive(action);
//                             setQuickAddOpen(false);
//                           }}
//                           className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
//                         >
//                           <span>{action}</span>
//                           <span className="text-zinc-300">›</span>
//                         </button>
//                       ))}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>

//               <button className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 sm:block">
//                 Notifications
//               </button>

//               <div className="relative">
//                 <button
//                   type="button"
//                   onClick={() =>
//                     setUserMenuOpen((prev) => (prev === "navbar" ? null : "navbar"))
//                   }
//                   className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-3 py-1 text-left shadow-sm transition hover:bg-zinc-50"
//                 >
//                   <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 font-bold text-white">
//                     K
//                     <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
//                   </div>
//                   <div className="hidden pr-2 sm:block">
//                     <p className="text-sm font-semibold">Karan</p>
//                     <p className="text-xs text-emerald-600">Logged in</p>
//                   </div>
//                 </button>

//                 {userMenuOpen === "navbar" ? (
//                   <div className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl shadow-zinc-900/10">
//                     <button
//                       type="button"
//                       className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
//                     >
//                       Profile
//                     </button>
//                     <button
//                       type="button"
//                       className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
//                       onClick={() => alert("Logout clicked")}
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </header>

//           {/* PAGE CONTENT */}
//           <div className="mx-auto w-full bg-amber-300 max-w-7xl flex-1 px-4 py-4 sm:px-6">
//             <div className="mb-8">
//               {/* Breadcrumbs */}
//               <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-zinc-500">
//                 {breadcrumbs.map((item, index) => {
//                   const isLast = index === breadcrumbs.length - 1;

//                   return (
//                     <div key={`${item}-${index}`} className="flex items-center gap-2">
//                       {index > 0 ? <span className="text-zinc-300">/</span> : null}
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (!isLast) {
//                             setActive(item === "Admin" ? "Overview" : item);
//                           }
//                         }}
//                         className={`rounded-full px-3 py-1 transition ${
//                           isLast
//                             ? "bg-white font-semibold text-zinc-950 shadow-sm"
//                             : "hover:bg-white hover:text-zinc-950"
//                         }`}
//                       >
//                         {item}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </nav>

             
//             </div>
            

//             {/* Demo Content */}
        

            
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }
