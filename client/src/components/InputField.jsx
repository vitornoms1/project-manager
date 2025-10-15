import React from 'react';

const InputField = ({ id, label, type, value, onChange, placeholder, required, children }) => {
  return (
    <div className="mb-6 relative">
      <label htmlFor={id} className="block text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
          placeholder={placeholder}
          required={required}
        />
        {children}
      </div>
    </div>
  );
};

export default InputField;