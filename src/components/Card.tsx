import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-base font-semibold text-slate-600 mb-2">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
