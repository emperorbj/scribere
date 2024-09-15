import Header from "./Header";
import { Outlet } from "react-router-dom";
export default function Layout() {

  return (

    <main className="bg-gray-100 p-6 min-h-screen">
      <Header />
      <Outlet />
    </main>
  );
}