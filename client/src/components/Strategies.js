import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Strategies = () => {
  const [predefinedStrategies, setPredefinedStrategies] = useState([]);
  const [userStrategies, setUserStrategies] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: '',
    buyCondition: '',
    sellCondition: '',
    risk: 'Medium'
  });

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const [predefined, user] = await Promise.all([
        axios.get('/api/strategies/predefined'),
        axios.get('/api/strategies/user')
      ]);
      setPredefinedStrategies(predefined.data);
      setUserStrategies(user.data);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    }
  };

  const handleCreateStrategy = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/strategies', newStrategy);
      setUserStrategies([...userStrategies, response.data]);
      setNewStrategy({
        name: '',
        description: '',
        buyCondition: '',
        sellCondition: '',
        risk: 'Medium'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating strategy:', error);
    }
  };

  const StrategyCard = ({ strategy, isPredefined = true }) => (
    <div className="card strategy-card">
      <h3>{strategy.name}</h3>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        {strategy.description}
      </p>
      
      <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
        <div><strong>Buy:</strong> {strategy.buyCondition}</div>
        <div><strong>Sell:</strong> {strategy.sellCondition}</div>
      </div>

      <div className="strategy-meta">
        <span className={`risk-badge risk-${strategy.risk.toLowerCase()}`}>
          {strategy.risk} Risk
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            Use Strategy
          </button>
          {!isPredefined && (
            <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Trading Strategies</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Strategy
          </button>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Predefined Strategies</h2>
          <div className="strategy-grid">
            {predefinedStrategies.map(strategy => (
              <StrategyCard key={strategy.id} strategy={strategy} isPredefined={true} />
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: '1rem' }}>My Strategies</h2>
          {userStrategies.length > 0 ? (
            <div className="strategy-grid">
              {userStrategies.map(strategy => (
                <StrategyCard key={strategy.id} strategy={strategy} isPredefined={false} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <h3 style={{ color: '#6b7280' }}>No custom strategies yet</h3>
              <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
                Create your first custom trading strategy
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Strategy
              </button>
            </div>
          )}
        </div>

        {showCreateForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Create New Strategy</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateStrategy}>
                <div className="form-group">
                  <label>Strategy Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={newStrategy.description}
                    onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Buy Condition</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., price_change_24h < -5"
                    value={newStrategy.buyCondition}
                    onChange={(e) => setNewStrategy({...newStrategy, buyCondition: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sell Condition</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., price_change_24h > 10"
                    value={newStrategy.sellCondition}
                    onChange={(e) => setNewStrategy({...newStrategy, sellCondition: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Risk Level</label>
                  <select
                    className="form-control"
                    value={newStrategy.risk}
                    onChange={(e) => setNewStrategy({...newStrategy, risk: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Strategy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Strategies;