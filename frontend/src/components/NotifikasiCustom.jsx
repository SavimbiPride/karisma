import React from 'react';

export default function NotifikasiCustom({ message, onConfirm, onCancel, singleButton = false, buttonLabel = "OK" }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-[#000046] text-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <img src="/1-43.png" alt="Robot" className="w-32 mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        
        {singleButton ? (
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md"
            >
              {buttonLabel}
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-6">
            <button
              onClick={onConfirm}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md"
            >
              Iya
            </button>
            <button
              onClick={onCancel}
              className="bg-[#162466] hover:bg-[#1e2e91] px-6 py-2 rounded-md"
            >
              Tidak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
