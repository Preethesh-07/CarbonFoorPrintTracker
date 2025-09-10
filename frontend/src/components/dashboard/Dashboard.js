import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activities
        const activitiesRes = await axios.get('/api/activities');
        setActivities(activitiesRes.data);

        // Fetch summary based on selected period
        const summaryRes = await axios.get(`/api/activities/summary/${period}`);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  // Prepare chart data
  const pieChartData = {
    labels: ['Electricity', 'Water', 'Gas', 'Waste', 'Transport'],
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: summary ? [
          summary.electricity.co2,
          summary.water.co2,
          summary.gas.co2,
          summary.waste.co2,
          summary.transport.co2
        ] : [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare line chart data (last 7 days trend)
  const getLastSevenDaysData = () => {
    const dates = [];
    const co2Data = [];

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      // Find activities for this date
      const dailyActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === date.toDateString();
      });

      // Sum CO2 for the day
      const dailyCO2 = dailyActivities.reduce((sum, activity) => sum + activity.totalCO2, 0);
      co2Data.push(dailyCO2);
    }

    return {
      labels: dates,
      datasets: [
        {
          label: 'Daily CO₂ Emissions (kg)',
          data: co2Data,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };
  };

  // Prepare bar chart data for activity comparison
  const barChartData = {
    labels: ['Electricity (kWh)', 'Water (L)', 'Gas (m³)', 'Waste (kg)', 'Transport (km)'],
    datasets: [
      {
        label: 'Your Usage',
        data: summary ? [
          summary.electricity.total,
          summary.water.total,
          summary.gas.total,
          summary.waste.total,
          summary.transport.total
        ] : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      },
      {
        label: 'Average Usage',
        // Example average values - in a real app, these would come from the backend
        data: [300, 2500, 25, 15, 100],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }
    ]
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>

      <div className="period-selector">
        <label htmlFor="period">View data for: </label>
        <select id="period" value={period} onChange={handlePeriodChange} className="form-control">
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
        </select>
      </div>

      {summary && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total CO₂</h3>
            <p>{summary.totalCO2.toFixed(2)} kg</p>
          </div>
          <div className="stat-card">
            <h3>Activities</h3>
            <p>{summary.totalActivities}</p>
          </div>
          <div className="stat-card">
            <h3>Electricity</h3>
            <p>{summary.electricity.co2.toFixed(2)} kg CO₂</p>
          </div>
          <div className="stat-card">
            <h3>Transport</h3>
            <p>{summary.transport.co2.toFixed(2)} kg CO₂</p>
          </div>
        </div>
      )}

      <div className="charts-container">
        <div className="chart-container">
          <h2>CO₂ Emissions by Category</h2>
          <Pie data={pieChartData} />
        </div>

        <div className="chart-container">
          <h2>Daily CO₂ Emissions (Last 7 Days)</h2>
          <Line data={getLastSevenDaysData()} />
        </div>

        <div className="chart-container">
          <h2>Your Usage vs. Average</h2>
          <Bar data={barChartData} />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Recent Activities</h2>
          {activities.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Electricity</th>
                    <th>Water</th>
                    <th>Gas</th>
                    <th>Waste</th>
                    <th>Transport</th>
                    <th>Total CO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.slice(0, 5).map(activity => (
                    <tr key={activity._id}>
                      <td>{new Date(activity.date).toLocaleDateString()}</td>
                      <td>{activity.electricity.value} {activity.electricity.unit}</td>
                      <td>{activity.water.value} {activity.water.unit}</td>
                      <td>{activity.gas.value} {activity.gas.unit}</td>
                      <td>{activity.waste.value} {activity.waste.unit}</td>
                      <td>
                        {activity.transport.distance} {activity.transport.unit} ({activity.transport.type})
                      </td>
                      <td>{activity.totalCO2.toFixed(2)} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No activities recorded yet. Start by logging your first activity!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;