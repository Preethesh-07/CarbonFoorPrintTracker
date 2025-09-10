import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tips = () => {
  const [tips, setTips] = useState([
    {
      id: 1,
      category: 'electricity',
      title: 'Reduce Electricity Usage',
      description: 'Switch to LED bulbs to save up to 80% energy compared to traditional incandescent bulbs.',
      savings: '0.5 kg CO₂ per bulb per day',
      difficulty: 'easy'
    },
    {
      id: 2,
      category: 'electricity',
      title: 'Unplug Electronics',
      description: 'Unplug electronics and appliances when not in use to avoid phantom energy usage.',
      savings: '0.3 kg CO₂ per device per day',
      difficulty: 'easy'
    },
    {
      id: 3,
      category: 'water',
      title: 'Fix Leaky Faucets',
      description: 'A dripping faucet can waste up to 3,000 gallons of water per year.',
      savings: '0.2 kg CO₂ per month',
      difficulty: 'medium'
    },
    {
      id: 4,
      category: 'water',
      title: 'Shorter Showers',
      description: 'Reducing your shower time by 2 minutes can save up to 10 gallons of water.',
      savings: '0.1 kg CO₂ per shower',
      difficulty: 'easy'
    },
    {
      id: 5,
      category: 'gas',
      title: 'Lower Thermostat',
      description: 'Lower your thermostat by 1°C to reduce heating energy by up to 10%.',
      savings: '1.5 kg CO₂ per day during winter',
      difficulty: 'easy'
    },
    {
      id: 6,
      category: 'gas',
      title: 'Insulate Your Home',
      description: 'Proper insulation can reduce heating and cooling needs by up to 20%.',
      savings: '3.0 kg CO₂ per day',
      difficulty: 'hard'
    },
    {
      id: 7,
      category: 'waste',
      title: 'Compost Food Scraps',
      description: 'Composting food waste reduces methane emissions from landfills.',
      savings: '0.8 kg CO₂ per kg of food waste',
      difficulty: 'medium'
    },
    {
      id: 8,
      category: 'waste',
      title: 'Reduce Single-Use Plastics',
      description: 'Use reusable bags, bottles, and containers to minimize plastic waste.',
      savings: '0.5 kg CO₂ per week',
      difficulty: 'medium'
    },
    {
      id: 9,
      category: 'transport',
      title: 'Carpool or Use Public Transport',
      description: 'Sharing rides can significantly reduce per-person carbon emissions.',
      savings: '2.0 kg CO₂ per 10 km',
      difficulty: 'medium'
    },
    {
      id: 10,
      category: 'transport',
      title: 'Bike or Walk for Short Trips',
      description: 'For trips under 2 miles, walking or biking produces zero emissions.',
      savings: '0.5 kg CO₂ per mile not driven',
      difficulty: 'medium'
    },
    {
      id: 11,
      category: 'general',
      title: 'Plant Trees',
      description: 'A single tree can absorb about 48 pounds of CO₂ per year.',
      savings: '22 kg CO₂ per tree per year',
      difficulty: 'medium'
    },
    {
      id: 12,
      category: 'general',
      title: 'Choose Renewable Energy',
      description: 'Switch to a renewable energy provider to reduce your carbon footprint.',
      savings: 'Up to 1,500 kg CO₂ per year',
      difficulty: 'medium'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch tips from the backend
    // For now, we're using the hardcoded tips

    // Fetch user stats to provide personalized recommendations
    const fetchUserStats = async () => {
      try {
        const res = await axios.get('/api/activities/summary');
        setUserStats(res.data);
      } catch (err) {
        console.error('Error fetching user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Filter tips based on selected category and difficulty
  const filteredTips = tips.filter(tip => {
    const categoryMatch = selectedCategory === 'all' || tip.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || tip.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // Get personalized recommendations based on user's highest carbon categories
  const getPersonalizedRecommendations = () => {
    if (!userStats) return [];

    // Find the category with the highest carbon footprint
    const categories = ['electricity', 'water', 'gas', 'waste', 'transport'];
    let highestCategory = categories[0];
    let highestValue = userStats[highestCategory] || 0;

    categories.forEach(category => {
      if ((userStats[category] || 0) > highestValue) {
        highestValue = userStats[category];
        highestCategory = category;
      }
    });

    // Return tips for that category
    return tips.filter(tip => tip.category === highestCategory);
  };

  const personalizedTips = getPersonalizedRecommendations();

  return (
    <div className="tips-container">
      <h1>Eco-Friendly Tips</h1>
      <p className="lead">Reduce your carbon footprint with these actionable recommendations</p>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            <option value="all">All Categories</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water</option>
            <option value="gas">Gas</option>
            <option value="waste">Waste</option>
            <option value="transport">Transport</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="difficulty-filter">Filter by Difficulty:</label>
          <select
            id="difficulty-filter"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="form-control"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {personalizedTips.length > 0 && (
        <div className="personalized-section">
          <h2>Recommended for You</h2>
          <p>Based on your activity data, here are some tips to reduce your carbon footprint:</p>
          
          <div className="tips-grid">
            {personalizedTips.map(tip => (
              <div key={tip.id} className={`tip-card ${tip.category}`}>
                <div className="tip-header">
                  <h3>{tip.title}</h3>
                  <span className={`difficulty-badge ${tip.difficulty}`}>{tip.difficulty}</span>
                </div>
                <p className="tip-description">{tip.description}</p>
                <div className="tip-savings">
                  <strong>Potential Savings:</strong> {tip.savings}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2>All Tips</h2>
      {loading ? (
        <p>Loading tips...</p>
      ) : filteredTips.length === 0 ? (
        <p>No tips found for the selected filters.</p>
      ) : (
        <div className="tips-grid">
          {filteredTips.map(tip => (
            <div key={tip.id} className={`tip-card ${tip.category}`}>
              <div className="tip-header">
                <h3>{tip.title}</h3>
                <span className={`difficulty-badge ${tip.difficulty}`}>{tip.difficulty}</span>
              </div>
              <p className="tip-description">{tip.description}</p>
              <div className="tip-savings">
                <strong>Potential Savings:</strong> {tip.savings}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="eco-fact">
        <h3>Did You Know?</h3>
        <p>If every American home replaced just one light bulb with an ENERGY STAR qualified bulb, we would save enough energy to light more than 3 million homes for a year and prevent greenhouse gas emissions equivalent to more than 800,000 cars.</p>
      </div>
    </div>
  );
};

export default Tips;