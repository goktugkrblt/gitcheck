export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Your Score</div>
            <div className="text-4xl font-bold text-blue-500">-</div>
          </div>
  
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Total Repos</div>
            <div className="text-4xl font-bold text-white">-</div>
          </div>
  
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-2">Total Stars</div>
            <div className="text-4xl font-bold text-white">-</div>
          </div>
        </div>
  
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <p className="text-gray-400 mb-4">
            Click below to analyze your GitHub profile
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Analyze Profile
          </button>
        </div>
      </div>
    );
  }