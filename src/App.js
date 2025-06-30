import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Upload, Download, TrendingUp, Droplets, Home, BarChart3, Leaf, Moon, Sun } from 'lucide-react';

const HydroMonitor = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [plantData, setPlantData] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ph: '',
    tds: '',
    temperature: '',
    humidity: '',
    dissolvedOxy: ''
  });
  const [error, setError] = useState('');
  const [isVideoMaximized, setIsVideoMaximized] = useState(false);
  const [pastDays, setPastDays] = useState(7);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [dummyData, setDummyData] = useState({
    colors: [
      { hex: '#4CAF50', health: 'Healthy' },
      { hex: '#FF9800', health: 'Moderate' },
      { hex: '#F44336', health: 'Unhealthy' }
    ]
  });

  const csvInputRef = useRef(null);

  const plantInfo = {
    'Bok choy': {
      image: '/assets/water-spinach.png',
      color: isDarkMode ? 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)' : '#e0f2f2',
      description: 'Nutrient-rich leafy green',
      optimalPH: '5.5-6.5',
      optimalTDS: '900-1200',
      optimalTemperature: '18-24',
      optimalHumidity: '50-70',
      optimalDissolvedOxy: '5-8'
    },
    'Chili': {
      image: '/assets/chili-plant.png',
      color: isDarkMode ? 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)' : '#f0e6e6',
      description: 'Spicy pepper variety',
      optimalPH: '6.0-6.8',
      optimalTDS: '1000-1750',
      optimalTemperature: '21-29',
      optimalHumidity: '60-80',
      optimalDissolvedOxy: '5-8'
    },
    'Purple basil': {
      image: '/assets/purple-basil.png',
      color: isDarkMode ? 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)' : '#ece6f0',
      description: 'Aromatic purple-leafed herb',
      optimalPH: '5.5-6.5',
      optimalTDS: '500-800',
      optimalTemperature: '20-26',
      optimalHumidity: '50-70',
      optimalDissolvedOxy: '5-8'
    },
    'Thai basil': {
      image: '/assets/thai-basil.png',
      color: isDarkMode ? 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)' : '#e6f0ea',
      description: 'Sweet and spicy Asian herb',
      optimalPH: '6.0-7.0',
      optimalTDS: '600-900',
      optimalTemperature: '20-26',
      optimalHumidity: '50-70',
      optimalDissolvedOxy: '5-8'
    },
    'Lemon basil': {
      image: '/assets/lemon-basil.png',
      color: isDarkMode ? 'linear-gradient(135deg, #0f172a 2%, #1e3a8a 50%, #312e81 100%)' : '#f0f4e6',
      description: 'Citrusy aromatic herb',
      optimalPH: '5.8-6.8',
      optimalTDS: '500-750',
      optimalTemperature: '20-26',
      optimalHumidity: '50-70',
      optimalDissolvedOxy: '5-8'
    }
  };

  const isImagePath = (image) => typeof image === 'string' && /\.(jpg|jpeg|png|gif|webp)$/i.test(image);

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)' 
        : 'linear-gradient(135deg, #e6f3f5 0%, #c9e4e6 50%, #b3d9db 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      transition: 'all 0.3s ease',
      '@media (max-width: 768px)': {
        padding: '16px 8px',
      },
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 16px',
    },
    card: {
      background: isDarkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: isDarkMode ? 'blur(16px)' : 'none',
      borderRadius: '24px',
      boxShadow: isDarkMode 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
        : '0 10px 20px rgba(0, 0, 0, 0.1)',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.2)' 
        : '1px solid rgba(0, 0, 0, 0.1)',
      padding: '32px',
    },
    title: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center',
      color: isDarkMode ? '#60a5fa' : '#2a6f6f', // Simple color instead of gradient
      display: 'inline-block',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: isDarkMode ? '#bfdbfe' : '#4a9b9b',
      textAlign: 'center',
      marginBottom: '48px',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    primaryButton: {
      background: isDarkMode ? '#212763' : '#8ab4b4',
      color: isDarkMode ? 'white' : 'white',
      '&:hover': {
        background: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : '#c9e4e6',
      },
    },
    activeButton: {
      background: isDarkMode ? '#212763' : '#8ab4b4',
      color: 'white',
    },
    greenButton: {
      background: isDarkMode ? '#212763' : '#8ab4b4',
      color: 'white',
      '&:hover': {
        background: isDarkMode ? '#059669' : '#4a9b9b',
      },
    },
    purpleButton: {
      background: isDarkMode ? '#212763' : '#8ab4b4',
      color: 'white',
      '&:hover': {
        background: isDarkMode ? '#7c3aed' : '#6cc3c3',
      },
    },
    themeToggle: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '50px',
      background: isDarkMode ? '#1e3a8a' : '#c9e4e6',
      border: '2px solid ' + (isDarkMode ? '#60a5fa' : '#4a9b9b'),
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: isDarkMode 
        ? '0 4px 15px rgba(96, 165, 250, 0.5)' 
        : '0 4px 15px rgba(74, 155, 155, 0.5)',
      transition: 'all 0.3s ease',
      transform: 'scale(0.7)', // Reduce size to 70%
      '&:hover': {
        transform: 'scale(0.77)', // Adjusted hover scale
        background: isDarkMode ? '#2a5caa' : '#b3d9db',
      },
    },
    themeIcon: {
      color: isDarkMode ? '#60a5fa' : '#4a9b9b',
      transition: 'all 0.3s ease',
    },
    plantCard: {
      padding: '32px',
      borderRadius: '16px',
      cursor: 'pointer',
      transform: 'scale(1)',
      transition: 'all 0.3s ease',
      boxShadow: isDarkMode 
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
        : '0 10px 20px rgba(0, 0, 0, 0.1)',
      border: isDarkMode 
        ? '1px solid rgba(255, 255, 255, 0.2)' 
        : '1px solid rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    plantEmoji: {
      fontSize: '5rem',
      marginBottom: '16px',
    },
    plantName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: isDarkMode ? 'white' : '#2a6f6f',
      marginBottom: '8px',
    },
    plantDescription: {
      color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : '#4a9b9b',
      marginBottom: '16px',
    },
    plantStats: {
      background: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(201, 228, 230, 0.5)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
    },
    input: {
      width: '100%',
      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e6f3f5',
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #b3d9db',
      borderRadius: '12px',
      padding: '12px 16px',
      color: isDarkMode ? 'white' : '#2a6f6f',
      fontSize: '16px',
      '&::placeholder': {
        color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#8ab4b4',
      },
      '&:focus': {
        outline: 'none',
        border: '2px solid ' + (isDarkMode ? '#60a5fa' : '#4a9b9b'),
      },
    },
    label: {
      color: isDarkMode ? 'white' : '#2a6f6f',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    grid: {
      display: 'grid',
      gap: '32px',
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    gridCols2: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '32px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      color: isDarkMode ? 'white' : '#2a6f6f',
    },
    th: {
      textAlign: 'left',
      padding: '12px 16px',
      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #b3d9db',
      fontWeight: '600',
    },
    td: {
      padding: '12px 16px',
      borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e6f3f5',
    },
    chartContainer: {
      background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(201, 228, 230, 0.3)',
      borderRadius: '16px',
      padding: '24px',
    },
    chartTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: isDarkMode ? 'white' : '#2a6f6f',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    pageTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: isDarkMode ? 'white' : '#2a6f6f',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    submitButton: {
      width: '100%',
      background: isDarkMode 
        ? 'linear-gradient(135deg,rgb(2, 17, 53) 2%,rgb(4, 0, 119) 100%)' 
        : 'linear-gradient(135deg, #b3d9db 0%, #6cc3c3 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    resetButton: {
      width: '100%',
      background: isDarkMode 
        ? 'linear-gradient(135deg,rgb(28, 36, 54) 2%,rgb(60, 58, 110) 100%)' 
        : 'linear-gradient(135deg, #e0f2f2 0%, #c9e4e6 100%)',
      color: 'white',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1.125rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    statsCard: {
      padding: '24px',
      borderRadius: '16px',
      color: isDarkMode ? 'white' : '#2a6f6f',
      textAlign: 'center',
    },
    statsIcon: {
      fontSize: '2rem',
      marginRight: '12px',
    },
    statsTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
    },
    error: {
      color: isDarkMode ? '#f87171' : '#e06666',
      fontSize: '1rem',
      marginBottom: '16px',
      textAlign: 'center',
    },
    videoContainer: {
      position: 'fixed',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      borderRadius: '12px',
      overflow: 'hidden',
      background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(201, 228, 230, 0.5)',
      border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #b3d9db',
      cursor: 'pointer',
    },
    videoMinimized: {
      bottom: '17px',
      left: '17px',
      width: '170px',
      height: '100px',
    },
    videoMaximized: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      height: '50vh',
      zIndex: 2000,
      boxShadow: isDarkMode 
        ? '0 0 20px 8px rgba(255, 255, 255, 0.7)' 
        : '0 0 20px 8px rgba(74, 155, 155, 0.7)',
      border: isDarkMode ? '2px solid rgba(255, 255, 255, 0.9)' : '2px solid #4a9b9b',
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  };

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/readings')
      .then(response => response.json())
      .then(data => {
        setPlantData(data);
      })
      .catch(error => setError('Failed to fetch data from server.'))
      .finally(() => setIsLoading(false));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleResetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      tds: '',
      temperature: '',
      humidity: '',
      dissolvedOxy: ''
    });
    setError('');
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.ph || !formData.tds || !formData.temperature || !formData.humidity || !formData.dissolvedOxy) {
      setError('Please fill in all required fields (Date, pH, TDS, Temperature, Humidity, Dissolved Oxygen).');
      return;
    }
    if (isNaN(formData.ph) || formData.ph < 0 || formData.ph > 14) {
      setError('pH must be a number between 0 and 14.');
      return;
    }
    if (isNaN(formData.tds) || formData.tds < 0) {
      setError('TDS must be a positive number.');
      return;
    }
    if (isNaN(formData.temperature)) {
      setError('Temperature must be a number.');
      return;
    }
    if (isNaN(formData.humidity) || formData.humidity < 0 || formData.humidity > 100) {
      setError('Humidity must be a number between 0 and 100.');
      return;
    }
    if (isNaN(formData.dissolvedOxy) || formData.dissolvedOxy < 0) {
      setError('Dissolved Oxygen must be a positive number.');
      return;
    }

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      temperature: parseFloat(formData.temperature),
      ph: parseFloat(formData.ph),
      tds: parseFloat(formData.tds),
      humidity: parseFloat(formData.humidity),
      dissolvedOxy: parseFloat(formData.dissolvedOxy),
    };

    fetch('http://localhost:5000/api/readings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    })
      .then((response) => response.json())
      .then(() => {
        setPlantData((prev) => [...prev, newEntry]);
        handleResetForm();
        setCurrentPage('dashboard');
        setError('');
      })
      .catch((error) => setError('Failed to save entry.'));
  };

  // Update exportToCSV to include new columns
  const exportToCSV = () => {
    const csvData = [['id', 'timestamp', 'temperature', 'ph', 'tds', 'humidity', 'dissolvedOxy']];
    plantData.forEach(row => {
      csvData.push([row.id, row.timestamp, row.temperature, row.ph, row.tds, row.humidity, row.dissolvedOxy]);
    });
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hydro_monitor_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          setError('Invalid CSV file: No data found.');
          return;
        }
        const headers = lines[0].split(',').map(header => header.trim());
        if (!headers.includes('id') || !headers.includes('timestamp') || !headers.includes('temperature') || !headers.includes('ph') || !headers.includes('tds')) {
          setError('Invalid CSV file: Required headers (id, timestamp, temperature, ph, tds) missing.');
          return;
        }

        const importedData = lines.slice(1).map(line => {
          const values = line.split(',').map(val => val.trim());
          return {
            id: values[0] || Date.now() + Math.random(),
            timestamp: values[1] || new Date().toISOString(),
            temperature: parseFloat(values[2]) || 0,
            ph: parseFloat(values[3]) || 0,
            tds: parseFloat(values[4]) || 0
          };
        });

        fetch('http://localhost:5000/api/readings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(importedData)
        })
          .then(response => response.json())
          .then(() => {
            setPlantData(prev => [...prev, ...importedData]);
            setError('CSV imported successfully!');
            if (csvInputRef.current) csvInputRef.current.value = '';
          })
          .catch(error => setError('Error importing CSV: Please ensure the file is valid.'));
      } catch (err) {
        setError('Error importing CSV: Please ensure the file is valid.');
      }
    };
    reader.readAsText(file);
  };

  const getChartData = (dataType) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - pastDays);
    return plantData
      .filter(entry => new Date(entry.timestamp) >= cutoffDate)
      .map(entry => ({
        timestamp: new Date(entry.timestamp).toLocaleDateString(), // Readable date
        [dataType]: entry[dataType]
      }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getTrendAnalysis = (dataType, days) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const recentData = plantData
      .filter(entry => new Date(entry.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (recentData.length < 2) {
      return { trend: 'Insufficient data', slope: 0, rangeStatus: '' };
    }

    const values = recentData.map(entry => entry[dataType]);
    const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
    const firstHalf = values.slice(0, Math.ceil(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const slope = secondAvg - firstAvg;
    let trend = 'Stable';
    if (slope > 0.1) trend = 'Increasing';
    else if (slope < -0.1) trend = 'Decreasing';

    let rangeStatus = '';
    Object.keys(plantInfo).forEach(plantName => {
      const optimalRange = dataType === 'ph' ? plantInfo[plantName].optimalPH :
                          dataType === 'tds' ? plantInfo[plantName].optimalTDS :
                          plantInfo[plantName].optimalTemperature;
      const [min, max] = optimalRange.split('-').map(Number);
      if (avgValue < min) rangeStatus += `${plantName}: Below optimal (${optimalRange}). `;
      else if (avgValue > max) rangeStatus += `${plantName}: Above optimal (${optimalRange}). `;
      else rangeStatus += `${plantName}: Within optimal (${optimalRange}). `;
    });

    return { trend, slope: slope.toFixed(2), rangeStatus };
  };

  const dummyPrediction = () => {
    const plants = ['Bok choy', 'Chili', 'Purple basil', 'Thai basil', 'Lemon basil'];
    return plants[Math.floor(Math.random() * plants.length)];
  };

  const generateDummyData = () => {
    const colors = [
      { hex: `#${Math.floor(Math.random()*16777215).toString(16)}`, health: ['Healthy', 'Moderate', 'Unhealthy'][Math.floor(Math.random() * 3)] },
      { hex: `#${Math.floor(Math.random()*16777215).toString(16)}`, health: ['Healthy', 'Moderate', 'Unhealthy'][Math.floor(Math.random() * 3)] },
      { hex: `#${Math.floor(Math.random()*16777215).toString(16)}`, health: ['Healthy', 'Moderate', 'Unhealthy'][Math.floor(Math.random() * 3)] }
    ];
    return { colors };
  };


  if (currentPage === 'entry') {
    return (
      <div style={styles.pageContainer}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={styles.themeToggle}
        >
          {isDarkMode ? <Sun size={20} style={styles.themeIcon} /> : <Moon size={20} style={styles.themeIcon} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <h1 style={styles.pageTitle}>Add New Entry</h1>
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  handleResetForm();
                }}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Home size={20} />
              </button>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={{ marginTop: '32px' }}>
              <div style={{ ...styles.grid, ...styles.gridCols3, marginBottom: '32px' }}>
                <div>
                  <label style={styles.label}>
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <Droplets size={16} />
                    pH Level
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => setFormData(prev => ({...prev, ph: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <TrendingUp size={16} />
                    TDS (ppm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.tds}
                    onChange={(e) => setFormData(prev => ({...prev, tds: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <TrendingUp size={16} />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({...prev, temperature: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <Droplets size={16} />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.humidity}
                    onChange={(e) => setFormData(prev => ({...prev, humidity: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>

                <div>
                  <label style={styles.label}>
                    <Droplets size={16} />
                    Dissolved Oxygen (mg/L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.dissolvedOxy}
                    onChange={(e) => setFormData(prev => ({...prev, dissolvedOxy: e.target.value}))}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={styles.submitButton}
                >
                  Save Entry
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  style={styles.resetButton}
                >
                  Reset Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'analytics') {
    return (
      <div style={styles.pageContainer}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={styles.themeToggle}
        >
          {isDarkMode ? <Sun size={20} style={styles.themeIcon} /> : <Moon size={20} style={styles.themeIcon} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <h1 style={styles.pageTitle}>
                <BarChart3 size={32} />
                Analytics Dashboard
              </h1>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Home size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={styles.label}>
                Analyze trends over the past
                <input
                  type="number"
                  min="1"
                  value={pastDays}
                  onChange={(e) => setPastDays(Math.max(1, parseInt(e.target.value) || 7))}
                  style={{ ...styles.input, width: '80px', marginLeft: '8px', marginRight: '8px' }}
                />
                days
              </label>
            </div>

            {getChartData('ph').length === 0 ? (
              <div style={styles.error}>No data available for analytics. Please add entries from the dashboard.</div>
            ) : (
              <div style={{ ...styles.grid, ...styles.gridCols2 }}>
                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <Droplets size={24} color={isDarkMode ? "#60a5fa" : "#4a9b9b"} />
                    pH Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('ph')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(74, 155, 155, 0.2)'} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"}
                        angle={-45} // Slight diagonal for better date fit
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"} domain={[0, 14]} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(201, 228, 230, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : '#2a6f6f',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="ph" stroke={isDarkMode ? "#10b981" : "#2e7c7c"} strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> pH affects nutrient availability in hydroponics. Most plants thrive within a pH range of 5.5–7.0. Values too low (acidic) can cause nutrient lockout, while values too high (alkaline) may reduce micronutrient uptake. Optimal ranges vary by plant (e.g., Bok choy: 5.5–6.5, Chili: 6.0–6.8).
                  </div>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('ph', pastDays).trend} (Change: {getTrendAnalysis('ph', pastDays).slope}). {getTrendAnalysis('ph', pastDays).rangeStatus}
                  </div>
                </div>

                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <TrendingUp size={24} color={isDarkMode ? "#34d399" : "#6cc3c3"} />
                    TDS Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('tds')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(74, 155, 155, 0.2)'} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"}
                        angle={-45} // Slight diagonal for better date fit
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"} domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(201, 228, 230, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : '#2a6f6f',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="tds" stroke={isDarkMode ? "#f59e0b" : "#5a8a8a"} strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> TDS (Total Dissolved Solids) measures nutrient concentration in ppm. Higher TDS supports vigorous growth for nutrient-hungry plants like Chili (1000–1750 ppm), while lower TDS suits herbs like basil (500–900 ppm). Excessive TDS can cause nutrient burn, while too low TDS may lead to deficiencies.
                  </div>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('tds', pastDays).trend} (Change: {getTrendAnalysis('tds', pastDays).slope}). {getTrendAnalysis('tds', pastDays).rangeStatus}
                  </div>
                </div>

                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <TrendingUp size={24} color={isDarkMode ? "#f59e0b" : "#8ab4b4"} />
                    Temperature Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('temperature')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(74, 155, 155, 0.2)'} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"}
                        angle={-45} // Slight diagonal for better date fit
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"} domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(201, 228, 230, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : '#2a6f6f',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke={isDarkMode ? "#8b5cf6" : "#6cc3c3"} strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> Temperature affects plant metabolism and nutrient uptake. Most hydroponic plants prefer 18–26°C. Higher temperatures (e.g., Chili: 21–29°C) can boost growth if nutrients are balanced, but excessive heat stresses plants. Low temperatures slow growth and nutrient absorption.
                  </div>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('temperature', pastDays).trend} (Change: {getTrendAnalysis('temperature', pastDays).slope}). {getTrendAnalysis('temperature', pastDays).rangeStatus}
                  </div>
                </div>

                {/* Add Humidity Analytics */}
                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <Droplets size={24} color={isDarkMode ? "#34d399" : "#6cc3c3"} />
                    Humidity Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('humidity')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(74, 155, 155, 0.2)'} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(201, 228, 230, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : '#2a6f6f',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="humidity" stroke={isDarkMode ? "#10b981" : "#2e7c7c"} strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> Humidity affects plant transpiration and nutrient uptake. Most hydroponic plants prefer humidity levels between 50–70%.
                  </div>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('humidity', pastDays).trend} (Change: {getTrendAnalysis('humidity', pastDays).slope}). {getTrendAnalysis('humidity', pastDays).rangeStatus}
                  </div>
                </div>

                {/* Add Dissolved Oxygen Analytics */}
                <div style={styles.chartContainer}>
                  <h2 style={styles.chartTitle}>
                    <Droplets size={24} color={isDarkMode ? "#8b5cf6" : "#6cc3c3"} />
                    Dissolved Oxygen Trends
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getChartData('dissolvedOxy')}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(74, 155, 155, 0.2)'} />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis stroke={isDarkMode ? "#94a3b8" : "#4a9b9b"} domain={[0, 'auto']} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(201, 228, 230, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: isDarkMode ? 'white' : '#2a6f6f',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="dissolvedOxy" stroke={isDarkMode ? "#8b5cf6" : "#6cc3c3"} strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '16px', fontSize: '0.9rem' }}>
                    <strong>Significance:</strong> Dissolved oxygen is crucial for root health in hydroponics. Levels above 5 mg/L are ideal for most plants.
                  </div>
                  <div style={{ color: isDarkMode ? '#bfdbfe' : '#4a9b9b', marginTop: '8px', fontSize: '0.9rem' }}>
                    <strong>Trend (past {pastDays} days):</strong> {getTrendAnalysis('dissolvedOxy', pastDays).trend} (Change: {getTrendAnalysis('dissolvedOxy', pastDays).slope}). {getTrendAnalysis('dissolvedOxy', pastDays).rangeStatus}
                  </div>
                </div>
              </div>
            )}

            <div style={{ ...styles.grid, ...styles.gridCols3, marginTop: '32px' }}>
              {Object.keys(plantInfo).map(plantName => {
                const entries = plantData.filter(entry => new Date(entry.timestamp) >= new Date().setDate(new Date().getDate() - pastDays));
                // const avgPH = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.ph, 0) / entries.length).toFixed(1) : 'N/A';
                // const avgTDS = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.tds, 0) / entries.length).toFixed(1) : 'N/A';
                // const avgTemperature = entries.length > 0 ? (entries.reduce((sum, entry) => sum + entry.temperature, 0) / entries.length).toFixed(1) : 'N/A';
                
                return (
                  <div key={plantName} style={{ ...styles.statsCard, background: plantInfo[plantName].color }}>
                    <div style={styles.statsTitle}>
                      <span style={styles.statsIcon}>
                        {isImagePath(plantInfo[plantName].image) ? (
                          <img
                            src={plantInfo[plantName].image}
                            alt={plantName}
                            style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          plantInfo[plantName].image
                        )}
                      </span>
                      {plantName}
                    </div>
                    <div>
                      <div style={styles.statItem}>
                        <span>Entries:</span>
                        <span style={{ fontWeight: '600' }}>{entries.length}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg pH:</span>
                        <span style={{ fontWeight: '600' }}>{plantInfo[plantName].optimalPH}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg TDS:</span>
                        <span style={{ fontWeight: '600' }}>{plantInfo[plantName].optimalTDS}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg Temperature:</span>
                        <span style={{ fontWeight: '600' }}>{plantInfo[plantName].optimalTemperature}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg Humidity:</span>
                        <span style={{ fontWeight: '600' }}>{plantInfo[plantName].optimalHumidity}</span>
                      </div>
                      <div style={styles.statItem}>
                        <span>Avg Dissolved Oxygen:</span>
                        <span style={{ fontWeight: '600' }}>{plantInfo[plantName].optimalDissolvedOxy}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'mlModel') {
    return (
      <div style={styles.pageContainer}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={styles.themeToggle}
        >
          {isDarkMode ? <Sun size={20} style={styles.themeIcon} /> : <Moon size={20} style={styles.themeIcon} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.flexBetween}>
              <h1 style={styles.pageTitle}>
                <Leaf size={32} />
                ML Model - Leaves Predictor & Color Analysis
              </h1>
              <button
                onClick={() => setCurrentPage('dashboard')}
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                <Home size={20} />
              </button>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <h2 style={{ ...styles.chartTitle, marginBottom: '24px' }}>Leaves Predictor</h2>
              <p style={{ color: isDarkMode ? 'white' : '#2a6f6f', fontSize: '1.2rem' }}>
                Predicted Plant: <strong>{dummyPrediction()}</strong>
              </p>
              <button
                onClick={() => setDummyData(generateDummyData())}
                style={{ ...styles.button, ...styles.greenButton, marginTop: '16px' }}
              >
                Refresh Prediction
              </button>

              <h2 style={{ ...styles.chartTitle, marginTop: '32px', marginBottom: '24px' }}>Color Detection & Analysis</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {dummyData.colors.map((color, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: color.hex,
                        borderRadius: '8px',
                        marginBottom: '8px',
                        border: '2px solid ' + (isDarkMode ? 'rgba(255, 255, 255, 0.2)' : '#b3d9db'),
                      }}
                    />
                    <p style={{ color: isDarkMode ? 'white' : '#2a6f6f' }}>Hex: {color.hex}</p>
                    <p style={{ color: isDarkMode ? 'white' : '#2a6f6f' }}>Health: {color.health}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div style={styles.pageContainer}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={styles.themeToggle}
      >
        {isDarkMode ? <Sun size={20} style={styles.themeIcon} /> : <Moon size={20} style={styles.themeIcon} />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
      <div style={styles.container}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={styles.title}>HydroMonitor</h1>
          <p style={styles.subtitle}>Advanced Hydroponic Plant Monitoring System</p>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}
          {isLoading && <div style={{ ...styles.error, color: isDarkMode ? 'white' : '#2a6f6f' }}>Loading...</div>}
          <div style={styles.flexCenter}>
            <button
              onClick={() => setCurrentPage('dashboard')}
              style={{
                ...styles.button,
                ...(currentPage === 'dashboard' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <Home size={16} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('analytics')}
              style={{
                ...styles.button,
                ...(currentPage === 'analytics' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
            <button
              onClick={() => setCurrentPage('entry')}
              style={{
                ...styles.button,
                ...(currentPage === 'entry' ? styles.activeButton : styles.primaryButton)
              }}
            >
              <Leaf size={16} />
              Add Entry
            </button>
            <button
              onClick={exportToCSV}
              style={{ ...styles.button, ...styles.greenButton }}
            >
              <Download size={16} />
              Export CSV
            </button>
            <div>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                style={{ ...styles.button, ...styles.purpleButton }}
              >
                <Upload size={16} />
                Import CSV
              </button>
            </div>
            <button
              onClick={() => setCurrentPage('mlModel')}
              style={{ ...styles.button, ...styles.purpleButton }}
            >
              <Leaf size={16} />
              ML Model
            </button>
          </div>

          <div style={{ ...styles.grid, ...styles.gridCols3 }}>
            {Object.keys(plantInfo).map(plantName => (
              <div
                key={plantName}
                style={{ ...styles.plantCard, background: plantInfo[plantName].color }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {isImagePath(plantInfo[plantName].image) ? (
                  <img
                    src={plantInfo[plantName].image}
                    alt={plantName}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                  />
                ) : (
                  <div style={styles.plantEmoji}>{plantInfo[plantName].image}</div>
                )}
                <h2 style={styles.plantName}>{plantName}</h2>
                <p style={styles.plantDescription}>{plantInfo[plantName].description}</p>
                <div style={styles.plantStats}>
                  <div style={{ fontSize: '0.875rem', color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#4a9b9b' }}>
                    <p style={{ margin: '4px 0' }}><strong>Optimal pH:</strong> {plantInfo[plantName].optimalPH}</p>
                    <p style={{ margin: '4px 0' }}><strong>Optimal TDS:</strong> {plantInfo[plantName].optimalTDS}</p>
                    <p style={{ margin: '4px 0' }}><strong>Optimal Temperature:</strong> {plantInfo[plantName].optimalTemperature}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {plantData.length > 0 && (
          <div style={{ ...styles.card, marginTop: '32px' }}>
            <h2 style={{ ...styles.chartTitle, textAlign: 'center', marginBottom: '24px' }}>Recent Entries</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Timestamp</th>
                    <th style={styles.th}>Temperature</th>
                    <th style={styles.th}>pH</th>
                    <th style={styles.th}>TDS</th>
                    <th style={styles.th}>Humidity</th>
                    <th style={styles.th}>Dissolved Oxygen</th>
                  </tr>
                </thead>
                <tbody>
                  {plantData
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 5)
                    .map(entry => (
                      <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <td style={styles.td}>{entry.id}</td>
                        <td style={styles.td}>{entry.timestamp}</td>
                        <td style={styles.td}>{entry.temperature}</td>
                        <td style={styles.td}>{entry.ph}</td>
                        <td style={styles.td}>{entry.tds}</td>
                        <td style={styles.td}>{entry.humidity}</td>
                        <td style={styles.td}>{entry.dissolvedOxy}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div
          style={{
            ...styles.videoContainer,
            ...(isVideoMaximized ? styles.videoMaximized : styles.videoMinimized)
          }}
          onClick={() => setIsVideoMaximized(prev => !prev)}
        >
          <video
            style={styles.video}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="./assets/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default HydroMonitor;
