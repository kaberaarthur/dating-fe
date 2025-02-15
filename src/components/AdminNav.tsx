"use client";

import { useState } from "react";
import { Menu, X, UserRoundPen } from "lucide-react";

const AdminNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 shadow-md p-4 mb-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Title */}
        <UserRoundPen className="text-white" />

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <NavLink href="/main">Home</NavLink>
          <NavLink href="/people">Profiles</NavLink>
          <NavLink href="/plans">Plans</NavLink>
          <NavLink href="/mpesa-transactions">Transactions</NavLink>
          <NavLink href="/subscriptions">Subscriptions</NavLink>
          <NavLink href="/superlikes-withdrawals">Withdrawals</NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-gray-800 p-4 rounded-lg">
          <NavLink href="/main" onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink href="/people" onClick={() => setIsOpen(false)}>Profiles</NavLink>
          <NavLink href="/plans" onClick={() => setIsOpen(false)}>Plans</NavLink>
          <NavLink href="/mpesa-transactions" onClick={() => setIsOpen(false)}>Transactions</NavLink>
          <NavLink href="/subscriptions" onClick={() => setIsOpen(false)}>Subscriptions</NavLink>
          <NavLink href="/superlikes-withdrawals" onClick={() => setIsOpen(false)}>Withdrawals</NavLink>
        </div>
      )}
    </nav>
  );
};

// Reusable NavLink Component
const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-sm md:text-md text-gray-200 hover:text-blue-400 transition-colors"
  >
    {children}
  </a>
);

export default AdminNav;
