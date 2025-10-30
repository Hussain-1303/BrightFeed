import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const SentimentGraph = ({ category, onClose }) => {
  const [sentiments, setSentiments] = useState({ positive: 0, neutral: 0, negative: 0 });
  const [loading, setLoading] = useState(true);
  const [totalArticles, setTotalArticles] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const filtered = data.filter(article => 
          category === 'all' || article.category.toLowerCase() === category.toLowerCase()
        );
        
        const sentimentTotals = filtered.reduce((acc, article) => {
          const compound = article.sentiment?.headline?.compound || 0;
          if (compound >= 0.05) acc.positive++;
          else if (compound <= -0.05) acc.negative++;
          else acc.neutral++;
          return acc;
        }, { positive: 0, neutral: 0, negative: 0 });
        
        setSentiments(sentimentTotals);
        setTotalArticles(filtered.length);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSentiment();
  }, [category]);

  useEffect(() => {
    if (loading || totalArticles === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    
    // Clear canvas
    ctx.clearRect(0, 0, 300, 300);
    
    const total = totalArticles;
    let startAngle = -Math.PI / 2; // Start from top
    
    const segments = [
      { name: 'Positive', count: sentiments.positive, color: '#10B981', emoji: '😊' },
      { name: 'Neutral', count: sentiments.neutral, color: '#F59E0B', emoji: '😐' },
      { name: 'Negative', count: sentiments.negative, color: '#EF4444', emoji: '😢' }
    ];
    
    // Draw pie chart
    segments.forEach((segment) => {
      const sliceAngle = (segment.count / total) * Math.PI * 2;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.fillStyle = segment.color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw percentage label
      if (segment.count > 0) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);
        
        const percentage = ((segment.count / total) * 100).toFixed(1);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
      
      startAngle += sliceAngle;
    });
    
    // Draw center circle (donut effect)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    
    // Draw center text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(total.toString(), centerX, centerY - 10);
    ctx.font = '12px Arial';
    ctx.fillText('Articles', centerX, centerY + 10);
    
  }, [sentiments, loading, totalArticles]);

  const getPercentage = (count) => {
    if (totalArticles === 0) return 0;
    return ((count / totalArticles) * 100).toFixed(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-1">Sentiment Analysis</h3>
          <p className="text-blue-100 text-sm">
            {category === 'all' ? 'All Categories' : `${category.charAt(0).toUpperCase() + category.slice(1)} News`}
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sentiment data...</p>
            </div>
          ) : totalArticles === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No articles found for analysis</p>
            </div>
          ) : (
            <>
              {/* Chart */}
              <div className="flex justify-center mb-6">
                <canvas 
                  ref={canvasRef} 
                  width="300" 
                  height="300" 
                  className="max-w-full"
                />
              </div>
              
              {/* Legend with stats */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">😊 Positive</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-500">{sentiments.positive}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({getPercentage(sentiments.positive)}%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">😐 Neutral</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-500">{sentiments.neutral}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({getPercentage(sentiments.neutral)}%)</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">😢 Negative</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-red-500">{sentiments.negative}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({getPercentage(sentiments.negative)}%)</span>
                  </div>
                </div>
              </div>

              {/* Summary insight */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>💡 Insight:</strong> {
                    sentiments.positive > sentiments.negative + sentiments.neutral
                      ? 'Most articles have a positive tone!'
                      : sentiments.negative > sentiments.positive + sentiments.neutral
                      ? 'Most articles have a negative tone.'
                      : 'Articles show a balanced sentiment distribution.'
                  }
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SentimentGraph;