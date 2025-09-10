const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  electricity: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'kWh'
    },
    co2Equivalent: {
      type: Number,
      default: 0
    }
  },
  water: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'liters'
    },
    co2Equivalent: {
      type: Number,
      default: 0
    }
  },
  gas: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'm³'
    },
    co2Equivalent: {
      type: Number,
      default: 0
    }
  },
  waste: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'kg'
    },
    co2Equivalent: {
      type: Number,
      default: 0
    }
  },
  transport: {
    type: {
      type: String,
      enum: ['car', 'bus', 'train', 'plane', 'bicycle', 'walking', 'other'],
      default: 'car'
    },
    distance: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'km'
    },
    co2Equivalent: {
      type: Number,
      default: 0
    }
  },
  totalCO2: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient queries
ActivitySchema.index({ userId: 1, date: -1 });

// Calculate CO2 equivalents before saving
ActivitySchema.pre('save', function(next) {
  // CO2 conversion factors (approximate values)
  const ELECTRICITY_FACTOR = 0.5; // kg CO2 per kWh
  const WATER_FACTOR = 0.0003; // kg CO2 per liter
  const GAS_FACTOR = 2.0; // kg CO2 per m³
  const WASTE_FACTOR = 0.5; // kg CO2 per kg waste
  const TRANSPORT_FACTORS = {
    car: 0.2, // kg CO2 per km
    bus: 0.1, // kg CO2 per km
    train: 0.05, // kg CO2 per km
    plane: 0.25, // kg CO2 per km
    bicycle: 0, // kg CO2 per km
    walking: 0, // kg CO2 per km
    other: 0.15 // kg CO2 per km
  };

  // Calculate CO2 equivalents
  this.electricity.co2Equivalent = this.electricity.value * ELECTRICITY_FACTOR;
  this.water.co2Equivalent = this.water.value * WATER_FACTOR;
  this.gas.co2Equivalent = this.gas.value * GAS_FACTOR;
  this.waste.co2Equivalent = this.waste.value * WASTE_FACTOR;
  this.transport.co2Equivalent = this.transport.distance * TRANSPORT_FACTORS[this.transport.type];

  // Calculate total CO2
  this.totalCO2 = (
    this.electricity.co2Equivalent +
    this.water.co2Equivalent +
    this.gas.co2Equivalent +
    this.waste.co2Equivalent +
    this.transport.co2Equivalent
  );

  next();
});

module.exports = mongoose.model('Activity', ActivitySchema);