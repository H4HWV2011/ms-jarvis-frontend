// components/TestingFrameworkDashboard.jsx
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function TestingFrameworkDashboard() {
  const [activeTab, setActiveTab] = useState('automated');
  const [testResults, setTestResults] = useState(null);
  const [biasResults, setBiasResults] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAutomatedTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/automated-testing-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testSuite: 'comprehensive',
          models: ['text-generation', 'sentiment-analysis'],
          automationLevel: 'full'
        })
      });
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Automated testing failed:', error);
    }
    setLoading(false);
  };

  const runBiasDetection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bias-fairness-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protectedAttributes: ['synthetic_group'],
          fairnessMetrics: ['demographic_parity', 'equal_opportunity', 'disparate_impact']
        })
      });
      const data = await response.json();
      setBiasResults(data);
    } catch (error) {
      console.error('Bias detection failed:', error);
    }
    setLoading(false);
  };

  const initializeContinuousMonitoring = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/continuous-monitoring-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monitoringConfig: { realTime: true },
          alertThresholds: {
            performance: { response_time: '2000ms' },
            fairness: { demographic_parity: '0.8' }
          }
        })
      });
      const data = await response.json();
      setMonitoringData(data);
    } catch (error) {
      console.error('Monitoring initialization failed:', error);
    }
    setLoading(false);
  };

  const createTestResultsChart = () => {
    if (!testResults?.testResults?.categories) return null;

    const categories = Object.keys(testResults.testResults.categories);
    const passRates = categories.map(cat => {
      const categoryData = testResults.testResults.categories[cat];
      return (categoryData.passed / categoryData.total) * 100;
    });

    return {
      labels: categories,
      datasets: [{
        label: 'Pass Rate (%)',
        data: passRates,
        backgroundColor: passRates.map(rate => 
          rate >= 95 ? 'rgba(34, 197, 94, 0.8)' :
          rate >= 80 ? 'rgba(251, 191, 36, 0.8)' :
          'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: passRates.map(rate => 
          rate >= 95 ? 'rgb(34, 197, 94)' :
          rate >= 80 ? 'rgb(251, 191, 36)' :
          'rgb(239, 68, 68)'
        ),
        borderWidth: 2
      }]
    };
  };

  const createFairnessChart = () => {
    if (!biasResults?.fairnessMetrics) return null;

    const metrics = Object.keys(biasResults.fairnessMetrics);
    const scores = metrics.map(metric => {
      const metricData = biasResults.fairnessMetrics[metric];
      return metricData.parity_ratio || metricData.eo_ratio || metricData.disparate_impact_ratio || 0;
    });

    return {
      labels: metrics.map(m => m.replace('_', ' ')),
      datasets: [{
        label: 'Fairness Score',
        data: scores,
        backgroundColor: scores.map(score => 
          score >= 0.8 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: scores.map(score => 
          score >= 0.8 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 2
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Testing Framework Results' }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  const tabs = [
    { id: 'automated', name: 'Automated Testing', icon: '🚀' },
    { id: 'bias', name: 'Bias Detection', icon: '⚖️' },
    { id: 'monitoring', name: 'Continuous Monitoring', icon: '📊' },
    { id: 'overview', name: 'Overview', icon: '📈' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            🧪 AI Testing Framework Dashboard
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Automated Testing • Bias Detection • Continuous Monitoring • Safety Validation
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={runAutomatedTests}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 transition-colors"
            >
              🚀 Run Automated Tests
            </button>
            <button
              onClick={runBiasDetection}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:bg-gray-300 transition-colors"
            >
              ⚖️ Execute Bias Detection
            </button>
            <button
              onClick={initializeContinuousMonitoring}
              disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:bg-gray-300 transition-colors"
            >
              📊 Initialize Monitoring
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex space-x-1 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          {/* Automated Testing Tab */}
          {activeTab === 'automated' && (
            <div>
              <h3 className="text-xl font-bold mb-4">🚀 Automated Testing Pipeline Results</h3>
              {testResults ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Test Results by Category</h4>
                    <div className="h-64">
                      {createTestResultsChart() && <Bar data={createTestResultsChart()} options={chartOptions} />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Pipeline Metrics</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><strong>Total Tests:</strong> {testResults.pipelineMetrics?.totalTests}</p>
                      <p><strong>Pass Rate:</strong> {testResults.pipelineMetrics?.passRate}</p>
                      <p><strong>Execution Time:</strong> {testResults.pipelineMetrics?.executionTime}</p>
                      <p><strong>Automation Score:</strong> {testResults.automationScore}</p>
                      <p><strong>CI/CD Status:</strong> {testResults.continuousIntegration?.pipelineStatus}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Run automated tests to see results...</p>
              )}
            </div>
          )}

          {/* Bias Detection Tab */}
          {activeTab === 'bias' && (
            <div>
              <h3 className="text-xl font-bold mb-4">⚖️ Bias Detection & Fairness Analysis</h3>
              {biasResults ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Fairness Metrics</h4>
                    <div className="h-64">
                      {createFairnessChart() && <Bar data={createFairnessChart()} options={chartOptions} />}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Compliance Report</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><strong>Overall Status:</strong> {biasResults.complianceReport?.overall_status}</p>
                      <p><strong>EU AI Act:</strong> {biasResults.complianceReport?.eu_ai_act?.status}</p>
                      <p><strong>NYC LL144:</strong> {biasResults.complianceReport?.nyc_ll144?.status}</p>
                      <p><strong>Recommendations:</strong> {biasResults.mitigationRecommendations?.length} items</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Run bias detection to see results...</p>
              )}
            </div>
          )}

          {/* Continuous Monitoring Tab */}
          {activeTab === 'monitoring' && (
            <div>
              <h3 className="text-xl font-bold mb-4">📊 Continuous Monitoring System</h3>
              {monitoringData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(monitoringData.monitoringStatus || {}).map(([module, status]) => (
                    <div key={module} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-lg capitalize mb-2">{module}</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Status:</strong> {status.status}</p>
                        <p><strong>Frequency:</strong> {status.monitoring_frequency}</p>
                        {status.metrics && Object.entries(status.metrics).map(([metric, data]) => (
                          <div key={metric} className="flex justify-between">
                            <span>{metric}:</span>
                            <span className={`font-medium ${
                              data.status === 'healthy' || data.status === 'compliant' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {data.current}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Initialize monitoring to see real-time data...</p>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold mb-4">📈 Testing Framework Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-4xl mb-2">🚀</div>
                  <h4 className="font-semibold">Automated Testing</h4>
                  <p className="text-sm text-gray-600 mt-2">Comprehensive test suite with AI-powered generation</p>
                  {testResults && <p className="text-lg font-bold text-blue-600 mt-2">{testResults.pipelineMetrics?.passRate}</p>}
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-4xl mb-2">⚖️</div>
                  <h4 className="font-semibold">Bias Detection</h4>
                  <p className="text-sm text-gray-600 mt-2">Fairness metrics and regulatory compliance</p>
                  {biasResults && <p className="text-lg font-bold text-purple-600 mt-2">{biasResults.complianceReport?.overall_status}</p>}
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-4xl mb-2">📊</div>
                  <h4 className="font-semibold">Continuous Monitoring</h4>
                  <p className="text-sm text-gray-600 mt-2">Real-time performance and safety tracking</p>
                  {monitoringData && <p className="text-lg font-bold text-green-600 mt-2">Active</p>}
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-4xl mb-2">🛡️</div>
                  <h4 className="font-semibold">Safety Validation</h4>
                  <p className="text-sm text-gray-600 mt-2">Comprehensive safety and security protocols</p>
                  <p className="text-lg font-bold text-orange-600 mt-2">Protected</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎯 Testing Framework Benefits Achieved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold">Automated Efficiency</h3>
              <p className="text-sm text-gray-600">AI-powered test generation and execution[2]</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold">Bias Prevention</h3>
              <p className="text-sm text-gray-600">Proactive fairness monitoring and compliance[7]</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold">Continuous Validation</h3>
              <p className="text-sm text-gray-600">Real-time performance and drift monitoring[33]</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="font-semibold">Safety Assurance</h3>
              <p className="text-sm text-gray-600">Comprehensive safety validation protocols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
