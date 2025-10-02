import React, { useState, useEffect, useRef } from 'react';

const SentimentGraph = ({ category, onClose }) => {
  const [sentiments, setSentiments] = useState({ positive: 0, neutral: 0, negative: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/news`);
        const data = await response.json();
        const filtered = data.filter(article => category === 'all' || article.category.toLowerCase() === category.toLowerCase());
        const sentimentTotals = filtered.reduce((acc, article) => {
          const compound = article.sentiment?.headline?.compound || 0;
          if (compound >= 0.05) acc.positive++;
          else if (compound <= -0.05) acc.negative++;
          else acc.neutral++;
          return acc;
        }, { positive: 0, neutral: 0, negative: 0 });
        setSentiments(sentimentTotals);
      } catch (error) {
        console.error('Error fetching sentiment data:', error);
      }
    };
    fetchSentiment();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const total = sentiments.positive + sentiments.neutral + sentiments.negative || 1; // Avoid division by zero
      let startAngle = 0;
      for (let sentiment in sentiments) {
        const angle = (sentiments[sentiment] / total) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 100, startAngle, startAngle + angle);
        ctx.fillStyle = sentiment === 'positive' ? '#4CAF50' : sentiment === 'neutral' ? '#FF9800' : '#F44336';
        ctx.fill();
        startAngle += angle;
      }
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${category} Sentiment`, 150, 170);
    }
  }, [category, sentiments]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">Sentiment Trends for {category}</h3>
        <canvas ref={canvasRef} id="sentimentCanvas" width="300" height="300" style={{ border: '1px solid #ccc' }}></canvas>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
};

export default SentimentGraph;