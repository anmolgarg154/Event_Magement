export default function NotFound() {
  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-900 to-purple-950">
            404
          </h1>
          <div className="h-1 w-32 bg-linear-to-r from-blue-400 to-purple-600 mx-auto mt-4"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-800 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={goHome}
            className="px-8 py-3 bg-linear-to-r from-blue-900 to-purple-950 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Home
          </button>
          
          <button 
            onClick={goBack}
            className="px-8 py-3 bg-gray-700 text-white font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm">
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  );
}