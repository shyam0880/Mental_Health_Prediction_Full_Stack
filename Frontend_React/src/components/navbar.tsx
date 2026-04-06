import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Brain, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { dark, toggle } = useTheme();

  // Upload is hidden from nav (feature exists at /upload but not exposed)
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/checkup", label: "AI Assessment" },
    { href: "/insights", label: "Data Insights" },
    { href: "/chat", label: "AI Assistant" },
  ];

  const NavLinks = ({ mobile = false, onClick = () => {} }) => (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} onClick={onClick}>
          <Button
            variant="ghost"
            className={`${
              location === item.href
                ? "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-100"
                : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
            } ${mobile ? "w-full justify-start" : ""} transition-colors duration-200 font-medium`}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md dark:shadow-slate-800/50 sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo — always left */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer shrink-0">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-800 dark:text-white">MHealthCheck</span>
            </div>
          </Link>

          {/* Desktop nav — right side */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="ml-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile nav — right side */}
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggle} className="text-slate-600 dark:text-slate-300">
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 dark:bg-slate-900">
                <div className="flex flex-col space-y-2 mt-8">
                  <NavLinks mobile onClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
}
