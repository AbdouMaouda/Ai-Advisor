function CustomPrompt() {

   return (
     <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask anything about your business metrics..."
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter or click → to send your question</p>
            </div>
  );
}
export default CustomPrompt;

//function quickPrompt(){}