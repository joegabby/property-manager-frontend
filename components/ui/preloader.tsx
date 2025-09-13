export default function PreloaderSpinner() {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-gray-200 border-t-cyan-600 animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-transparent border-r-pink-500 animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
}
