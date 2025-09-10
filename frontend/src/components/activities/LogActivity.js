import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    electricity: {
      value: 0,
      unit: 'kWh'
    },
    water: {
      value: 0,
      unit: 'liters'
    },
    gas: {
      value: 0,
      unit: 'm³'
    },
    waste: {
      value: 0,
      unit: 'kg'
    },
    transport: {
      type: 'car',
      distance: 0,
      unit: 'km'
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { date, electricity, water, gas, waste, transport } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert string values to numbers
      const dataToSubmit = {
        ...formData,
        electricity: {
          ...formData.electricity,
          value: parseFloat(formData.electricity.value)
        },
        water: {
          ...formData.water,
          value: parseFloat(formData.water.value)
        },
        gas: {
          ...formData.gas,
          value: parseFloat(formData.gas.value)
        },
        waste: {
          ...formData.waste,
          value: parseFloat(formData.waste.value)
        },
        transport: {
          ...formData.transport,
          distance: parseFloat(formData.transport.distance)
        }
      };

      await axios.post('/api/activities', dataToSubmit);
      setSuccess(true);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        electricity: { value: 0, unit: 'kWh' },
        water: { value: 0, unit: 'liters' },
        gas: { value: 0, unit: 'm³' },
        waste: { value: 0, unit: 'kg' },
        transport: { type: 'car', distance: 0, unit: 'km' }
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  // CO2 conversion factors
  const CO2_FACTORS = {
    electricity: 0.5, // kg CO2 per kWh
    water: 0.0003, // kg CO2 per liter
    gas: 2.0, // kg CO2 per m³
    waste: 0.5, // kg CO2 per kg
    transport: {
      car: 0.2, // kg CO2 per km
      bus: 0.1, // kg CO2 per km
      train: 0.05, // kg CO2 per km
      plane: 0.25, // kg CO2 per km
      bicycle: 0, // kg CO2 per km
      walking: 0, // kg CO2 per km
      other: 0.15 // kg CO2 per km
    }
  };

  // Calculate CO2 equivalents
  const calculateCO2 = (type, value, transportType = null) => {
    if (type === 'transport') {
      return (parseFloat(value) || 0) * CO2_FACTORS.transport[transportType];
    }
    return (parseFloat(value) || 0) * CO2_FACTORS[type];
  };

  return (
    <div className="log-activity">
      <h1>Log Your Activity</h1>
      <p className="lead">Track your daily resource usage to monitor your carbon footprint</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Activity logged successfully!</div>}

      <div className="card">
        <div className="card-body">
          <form onSubmit={onSubmit} className="activity-form">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Electricity</h3>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-col">
                    <label htmlFor="electricity.value" className="form-label">Usage</label>
                    <input
                      type="number"
                      id="electricity.value"
                      name="electricity.value"
                      value={electricity.value}
                      onChange={onChange}
                      className="form-control"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="electricity.unit" className="form-label">Unit</label>
                    <select
                      id="electricity.unit"
                      name="electricity.unit"
                      value={electricity.unit}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="kWh">kWh</option>
                    </select>
                  </div>
                </div>
                <div className="co2-equivalent">
                  <p>CO₂ Equivalent: {calculateCO2('electricity', electricity.value).toFixed(2)} kg</p>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Water</h3>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-col">
                    <label htmlFor="water.value" className="form-label">Usage</label>
                    <input
                      type="number"
                      id="water.value"
                      name="water.value"
                      value={water.value}
                      onChange={onChange}
                      className="form-control"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="water.unit" className="form-label">Unit</label>
                    <select
                      id="water.unit"
                      name="water.unit"
                      value={water.unit}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="liters">Liters</option>
                    </select>
                  </div>
                </div>
                <div className="co2-equivalent">
                  <p>CO₂ Equivalent: {calculateCO2('water', water.value).toFixed(2)} kg</p>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Gas</h3>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-col">
                    <label htmlFor="gas.value" className="form-label">Usage</label>
                    <input
                      type="number"
                      id="gas.value"
                      name="gas.value"
                      value={gas.value}
                      onChange={onChange}
                      className="form-control"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="gas.unit" className="form-label">Unit</label>
                    <select
                      id="gas.unit"
                      name="gas.unit"
                      value={gas.unit}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="m³">m³</option>
                    </select>
                  </div>
                </div>
                <div className="co2-equivalent">
                  <p>CO₂ Equivalent: {calculateCO2('gas', gas.value).toFixed(2)} kg</p>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Waste</h3>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-col">
                    <label htmlFor="waste.value" className="form-label">Amount</label>
                    <input
                      type="number"
                      id="waste.value"
                      name="waste.value"
                      value={waste.value}
                      onChange={onChange}
                      className="form-control"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="waste.unit" className="form-label">Unit</label>
                    <select
                      id="waste.unit"
                      name="waste.unit"
                      value={waste.unit}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
                <div className="co2-equivalent">
                  <p>CO₂ Equivalent: {calculateCO2('waste', waste.value).toFixed(2)} kg</p>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h3>Transport</h3>
              </div>
              <div className="card-body">
                <div className="form-row">
                  <div className="form-col">
                    <label htmlFor="transport.type" className="form-label">Type</label>
                    <select
                      id="transport.type"
                      name="transport.type"
                      value={transport.type}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="car">Car</option>
                      <option value="bus">Bus</option>
                      <option value="train">Train</option>
                      <option value="plane">Plane</option>
                      <option value="bicycle">Bicycle</option>
                      <option value="walking">Walking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-col">
                    <label htmlFor="transport.distance" className="form-label">Distance</label>
                    <input
                      type="number"
                      id="transport.distance"
                      name="transport.distance"
                      value={transport.distance}
                      onChange={onChange}
                      className="form-control"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-col">
                    <label htmlFor="transport.unit" className="form-label">Unit</label>
                    <select
                      id="transport.unit"
                      name="transport.unit"
                      value={transport.unit}
                      onChange={onChange}
                      className="form-control"
                    >
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>
                <div className="co2-equivalent">
                  <p>CO₂ Equivalent: {calculateCO2('transport', transport.distance, transport.type).toFixed(2)} kg</p>
                </div>
              </div>
            </div>

            <div className="total-co2">
              <h3>Total CO₂ Equivalent</h3>
              <p className="co2-value">
                {(
                  calculateCO2('electricity', electricity.value) +
                  calculateCO2('water', water.value) +
                  calculateCO2('gas', gas.value) +
                  calculateCO2('waste', waste.value) +
                  calculateCO2('transport', transport.distance, transport.type)
                ).toFixed(2)} kg
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Activity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogActivity;