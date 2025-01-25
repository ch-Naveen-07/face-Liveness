import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="animate-bounce">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold text-white">
          Successfully Verified!
        </h1>
        <p className="text-cyan-400 text-lg">
          You have been successfully authenticated as a real person.
        </p>
        <div className="text-white text-opacity-80">
          Welcome to your secure session.
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;