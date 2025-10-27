import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Activity, Info, Calculator, Layers, Check, X } from 'lucide-react';

const TBIRiskNavigator = () => {
  // Shared patient state across all modules
  const [patient, setPatient] = useState({
    age_65_plus: 0,
    vomiting_2_plus: 0,
    gcs_less_than_15: 0,
    skull_fracture: 0,
    dangerous_mechanism: 0,
    headache: 0,
    intoxication: 0,
    seizure: 0,
    anticoagulant: 0
  });

  const [activeTab, setActiveTab] = useState('module1');

  // Model coefficients (DO NOT CHANGE)
  const modelCoefficients = {
    intercept: -4.74,
    age_65_plus: 0.851,
    vomiting_2_plus: 1.281,
    gcs_less_than_15: 1.521,
    skull_fracture: 2.242,
    dangerous_mechanism: 0.425,
    headache: 0.148,
    intoxication: 0.077,
    seizure: 1.346,
    anticoagulant: 0.412
  };

  // Odds ratios for visualization
  const oddsRatios = {
    skull_fracture: 9.41,
    gcs_less_than_15: 4.58,
    seizure: 3.84,
    vomiting_2_plus: 3.60,
    age_65_plus: 2.34,
    dangerous_mechanism: 1.53,
    anticoagulant: 1.51,
    headache: 1.16,
    intoxication: 1.08
  };

  // Predictor labels
  const predictorLabels = {
    age_65_plus: 'Age ≥65 years',
    vomiting_2_plus: 'Vomiting ≥2 episodes',
    gcs_less_than_15: 'GCS <15',
    skull_fracture: 'Signs of skull fracture',
    dangerous_mechanism: 'Dangerous mechanism',
    headache: 'Headache',
    intoxication: 'Intoxication',
    seizure: 'Seizure',
    anticoagulant: 'Anticoagulant use'
  };

  // Calculate risk
  const riskCalculation = useMemo(() => {
    const z = modelCoefficients.intercept +
      patient.age_65_plus * modelCoefficients.age_65_plus +
      patient.vomiting_2_plus * modelCoefficients.vomiting_2_plus +
      patient.gcs_less_than_15 * modelCoefficients.gcs_less_than_15 +
      patient.skull_fracture * modelCoefficients.skull_fracture +
      patient.dangerous_mechanism * modelCoefficients.dangerous_mechanism +
      patient.headache * modelCoefficients.headache +
      patient.intoxication * modelCoefficients.intoxication +
      patient.seizure * modelCoefficients.seizure +
      patient.anticoagulant * modelCoefficients.anticoagulant;

    const probability = 1 / (1 + Math.exp(-z));
    const n_effective = 15000;
    const SE = Math.sqrt((probability * (1 - probability)) / n_effective);
    const z_score = 1.96;
    const ci_lower = Math.max(0, probability - z_score * SE);
    const ci_upper = Math.min(1, probability + z_score * SE);

    let category = 'Very Low';
    let categoryColor = 'text-green-600';
    let categoryBg = 'bg-green-50';
    let categoryBorder = 'border-green-200';
    
    if (probability >= 0.07) {
      category = 'High';
      categoryColor = 'text-red-600';
      categoryBg = 'bg-red-50';
      categoryBorder = 'border-red-200';
    } else if (probability >= 0.03) {
      category = 'Moderate';
      categoryColor = 'text-orange-600';
      categoryBg = 'bg-orange-50';
      categoryBorder = 'border-orange-200';
    } else if (probability >= 0.01) {
      category = 'Low';
      categoryColor = 'text-yellow-600';
      categoryBg = 'bg-yellow-50';
      categoryBorder = 'border-yellow-200';
    }

    return {
      probability,
      ci_lower,
      ci_upper,
      category,
      categoryColor,
      categoryBg,
      categoryBorder,
      percentage: (probability * 100).toFixed(2),
      ci_lower_pct: (ci_lower * 100).toFixed(2),
      ci_upper_pct: (ci_upper * 100).toFixed(2)
    };
  }, [patient]);

  // Active contributions
  const activeContributions = useMemo(() => {
    const contributions = [];
    Object.keys(patient).forEach(key => {
      if (patient[key] === 1) {
        contributions.push({
          name: predictorLabels[key],
          or: oddsRatios[key],
          coefficient: modelCoefficients[key]
        });
      }
    });
    return contributions.sort((a, b) => b.or - a.or);
  }, [patient]);

  // Clinical recommendation
  const recommendation = useMemo(() => {
    const risk = riskCalculation.probability;
    
    if (risk < 0.01) {
      return {
        text: 'Based on very low risk (<1%), CT imaging is generally not indicated unless clinical judgment suggests otherwise. Consider observation and discharge instructions with return precautions.',
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    } else if (risk < 0.02) {
      return {
        text: 'Based on low risk (1-2%), CT imaging may be considered based on clinical judgment, patient preference, and local protocols. Observation with serial neurological examinations is reasonable.',
        icon: Info,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    } else if (risk < 0.05) {
      return {
        text: 'Based on moderate risk (2-5%), CT imaging is recommended. This risk level aligns with most clinical guidelines for selective CT use in minor head injury.',
        icon: AlertCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    } else {
      return {
        text: 'Based on high risk (≥5%), CT imaging is strongly recommended. This patient has significant risk factors that warrant immediate neuroimaging evaluation.',
        icon: AlertCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
  }, [riskCalculation.probability]);

  const togglePredictor = (key) => {
    setPatient(prev => ({
      ...prev,
      [key]: prev[key] === 1 ? 0 : 1
    }));
  };

  const resetAll = () => {
    setPatient({
      age_65_plus: 0,
      vomiting_2_plus: 0,
      gcs_less_than_15: 0,
      skull_fracture: 0,
      dangerous_mechanism: 0,
      headache: 0,
      intoxication: 0,
      seizure: 0,
      anticoagulant: 0
    });
  };

  const RecommendationIcon = recommendation.icon;
  const chartData = activeContributions.map(contrib => ({
    name: contrib.name,
    or: contrib.or,
    displayName: contrib.name.length > 25 ? contrib.name.substring(0, 22) + '...' : contrib.name
  }));

  // CDR Evaluation Functions
  const evaluateCCHR = (p) => {
    if (p.gcs_less_than_15 || p.skull_fracture || p.vomiting_2_plus || p.age_65_plus) {
      return { recommend: true, tier: "High Risk" };
    }
    if (p.dangerous_mechanism) {
      return { recommend: true, tier: "Medium Risk" };
    }
    return { recommend: false, tier: "Low Risk" };
  };

  const evaluateNOC = (p) => {
    if (p.headache || p.vomiting_2_plus || p.age_65_plus || p.intoxication || p.seizure) {
      return { recommend: true };
    }
    return { recommend: false };
  };

  const evaluateNEXUS = (p) => {
    if (p.skull_fracture || p.gcs_less_than_15 || p.vomiting_2_plus) {
      return { recommend: true };
    }
    return { recommend: true }; // Conservative
  };

  const evaluateCHIP = (p) => {
    let majorCount = 0;
    let minorCount = 0;
    
    if (p.gcs_less_than_15) majorCount++;
    if (p.skull_fracture) majorCount++;
    if (p.seizure) majorCount++;
    
    if (p.age_65_plus) minorCount++;
    if (p.vomiting_2_plus) minorCount++;
    if (p.dangerous_mechanism) minorCount++;
    
    if (majorCount >= 1 || minorCount >= 2) {
      return { recommend: true };
    }
    return { recommend: false };
  };

  // CDR Results
  const cdrResults = useMemo(() => {
    const cchr = evaluateCCHR(patient);
    const noc = evaluateNOC(patient);
    const nexus = evaluateNEXUS(patient);
    const chip = evaluateCHIP(patient);
    
    return {
      cchr,
      noc,
      nexus,
      chip,
      yourModel1: riskCalculation.probability >= 0.01,
      yourModel2: riskCalculation.probability >= 0.02,
      yourModel3: riskCalculation.probability >= 0.03,
      yourModel5: riskCalculation.probability >= 0.05
    };
  }, [patient, riskCalculation.probability]);

  // Module 3: Threshold State
  const [threshold, setThreshold] = useState(2.0);
  const [costParams, setCostParams] = useState({
    ctCost: 1200,
    ciTBICost: 150000,
    fpCost: 200,
    radiationPerCT: 2.0
  });

  // Threshold performance data
  const thresholdData = {
    1.0: { sensitivity: 95.2, specificity: 20.8, npv: 99.0, ctRate: 79.8, nns: 20.3 },
    2.0: { sensitivity: 84.4, specificity: 51.8, npv: 98.7, ctRate: 49.7, nns: 14.2 },
    3.0: { sensitivity: 82.0, specificity: 57.7, npv: 98.7, ctRate: 44.0, nns: 13.0 },
    5.0: { sensitivity: 56.2, specificity: 82.8, npv: 97.8, ctRate: 18.8, nns: 8.1 },
    10.0: { sensitivity: 48.5, specificity: 88.6, npv: 97.5, ctRate: 12.9, nns: 6.4 }
  };

  // Interpolate threshold data
  const getThresholdMetrics = (t) => {
    const keys = Object.keys(thresholdData).map(Number).sort((a, b) => a - b);
    
    if (t <= keys[0]) return thresholdData[keys[0]];
    if (t >= keys[keys.length - 1]) return thresholdData[keys[keys.length - 1]];
    
    let lower = keys[0];
    let upper = keys[keys.length - 1];
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (t >= keys[i] && t <= keys[i + 1]) {
        lower = keys[i];
        upper = keys[i + 1];
        break;
      }
    }
    
    const ratio = (t - lower) / (upper - lower);
    const lowerData = thresholdData[lower];
    const upperData = thresholdData[upper];
    
    return {
      sensitivity: lowerData.sensitivity + ratio * (upperData.sensitivity - lowerData.sensitivity),
      specificity: lowerData.specificity + ratio * (upperData.specificity - lowerData.specificity),
      npv: lowerData.npv + ratio * (upperData.npv - lowerData.npv),
      ctRate: lowerData.ctRate + ratio * (upperData.ctRate - lowerData.ctRate),
      nns: lowerData.nns + ratio * (upperData.nns - lowerData.nns)
    };
  };

  const currentMetrics = getThresholdMetrics(threshold);
  const prevalence = 4.2; // 4.2% baseline

  // Calculate consequences
  const consequences = useMemo(() => {
    const perThousand = 1000;
    const ciTBICases = (prevalence / 100) * perThousand;
    const scans = (currentMetrics.ctRate / 100) * perThousand;
    const detected = ciTBICases * (currentMetrics.sensitivity / 100);
    const missed = ciTBICases - detected;
    const trueNeg = (perThousand - ciTBICases) * (currentMetrics.specificity / 100);
    const falsePos = scans - detected;
    
    const totalCost = (scans * costParams.ctCost) + (missed * costParams.ciTBICost) + (falsePos * costParams.fpCost);
    const costPerDetected = detected > 0 ? totalCost / detected : 0;
    const totalRadiation = scans * costParams.radiationPerCT;
    
    // Scan All comparison
    const scanAllScans = perThousand;
    const scanAllDetected = ciTBICases;
    const scanAllMissed = 0;
    const scanAllFalsePos = perThousand - ciTBICases;
    const scanAllCost = (scanAllScans * costParams.ctCost) + (scanAllFalsePos * costParams.fpCost);
    const scanAllRadiation = scanAllScans * costParams.radiationPerCT;
    
    return {
      scans: scans.toFixed(0),
      detected: detected.toFixed(1),
      missed: missed.toFixed(1),
      nns: currentMetrics.nns.toFixed(1),
      costPerDetected: costPerDetected.toFixed(0),
      totalRadiation: totalRadiation.toFixed(2),
      scanAll: {
        scans: scanAllScans.toFixed(0),
        detected: scanAllDetected.toFixed(1),
        missed: scanAllMissed.toFixed(1),
        cost: scanAllCost.toFixed(0),
        radiation: scanAllRadiation.toFixed(2)
      }
    };
  }, [threshold, currentMetrics, costParams]);



  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-blue-600" />
            TBI Risk Navigator
          </h1>
          <p className="text-lg text-slate-600">Evidence-Based Clinical Decision Support</p>
          <p className="text-sm text-slate-500">Predicting clinically important traumatic brain injury risk</p>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto gap-2">
            <TabsTrigger value="module1" className="flex items-center gap-2 py-3">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Risk Assessment</span>
              <span className="sm:hidden">Module 1</span>
            </TabsTrigger>
            <TabsTrigger value="module2" className="flex items-center gap-2 py-3">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">CDR Comparison</span>
              <span className="sm:hidden">Module 2</span>
            </TabsTrigger>
            <TabsTrigger value="module3" className="flex items-center gap-2 py-3">
              <Calculator className="w-4 h-4" />
              <span className="hidden sm:inline">Decision Analyzer</span>
              <span className="sm:hidden">Module 3</span>
            </TabsTrigger>
          </TabsList>

          {/* Module 1: Risk Assessment */}
          <TabsContent value="module1">
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-2xl text-blue-900 flex items-center gap-2">
                  <Activity className="w-6 h-6" />
                  Module 1: Intelligent Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Patient Assessment Form */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">📋 Patient Assessment</h3>
                    <button
                      onClick={resetAll}
                      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-slate-700 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.keys(patient).map((key) => (
                      <button
                        key={key}
                        onClick={() => togglePredictor(key)}
                        className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                          patient[key] === 1
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            patient[key] === 1
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-slate-300'
                          }`}>
                            {patient[key] === 1 && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium text-slate-700">
                            {predictorLabels[key]}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk Display */}
                <div className={`p-6 rounded-xl border-2 ${riskCalculation.categoryBorder} ${riskCalculation.categoryBg}`}>
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold text-slate-700">🎯 Predicted Risk of ciTBI</h3>
                    <div className="space-y-2">
                      <div className={`text-6xl font-bold ${riskCalculation.categoryColor}`}>
                        {riskCalculation.percentage}%
                      </div>
                      <div className="text-sm text-slate-600">
                        95% CI: [{riskCalculation.ci_lower_pct}% – {riskCalculation.ci_upper_pct}%]
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-3">
                        <span className={`px-4 py-2 rounded-full font-semibold text-lg ${riskCalculation.categoryBg} ${riskCalculation.categoryColor} border-2 ${riskCalculation.categoryBorder}`}>
                          Risk Category: {riskCalculation.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Predictor Contributions */}
                {activeContributions.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">📊 Risk Factor Contributions</h3>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <ResponsiveContainer width="100%" height={Math.max(200, activeContributions.length * 50)}>
                        <BarChart
                          data={chartData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" domain={[0, 10]} stroke="#64748b" />
                          <YAxis 
                            dataKey="displayName" 
                            type="category" 
                            width={150}
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                                    <p className="font-semibold text-slate-700">{payload[0].payload.name}</p>
                                    <p className="text-sm text-blue-600">Odds Ratio: {payload[0].value.toFixed(2)}×</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="or" radius={[0, 8, 8, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.or >= 5 ? '#dc2626' : entry.or >= 3 ? '#ea580c' : entry.or >= 2 ? '#f59e0b' : '#3b82f6'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-3 text-sm text-slate-600 text-center">
                        Odds ratios show how much each factor increases the likelihood of ciTBI
                      </div>
                    </div>
                  </div>
                )}

                {activeContributions.length === 0 && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Select one or more risk factors above to calculate the patient's ciTBI risk.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Clinical Recommendation */}
                {activeContributions.length > 0 && (
                  <Alert className={`${recommendation.bgColor} border-2 ${recommendation.borderColor}`}>
                    <RecommendationIcon className={`w-5 h-5 ${recommendation.color}`} />
                    <AlertDescription className={`${recommendation.color} font-medium`}>
                      <strong>💡 Clinical Recommendation:</strong> {recommendation.text}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Model Information */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                  <p className="font-semibold text-slate-700 mb-2">📚 Model Information:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>C-statistic: 0.7724 (95% CI: 0.757-0.788) - Excellent discrimination</li>
                    <li>Brier score: 0.0364 - Very good calibration</li>
                    <li>Validated on 15,000 patients from 9 studies (61,955 total patients)</li>
                    <li>Bootstrap-corrected optimism: 0.0103 - Robust performance</li>
                    <li>O/E ratio: 0.9702 - Well-calibrated predictions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Module 2: CDR Comparison */}
          <TabsContent value="module2">
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                  <Layers className="w-6 h-6" />
                  Module 2: Comparative CDR Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {activeContributions.length === 0 ? (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Please select patient risk factors in Module 1 to see how different Clinical Decision Rules would classify this patient.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-4">🏥 Clinical Decision Rule Comparison</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        This table shows how established CDRs and the predictive model would classify the current patient.
                      </p>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">CDR / Model</th>
                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700">Recommendation</th>
                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700">Sensitivity</th>
                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700">Specificity</th>
                            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-slate-700">CT Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* CCHR High Risk */}
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="border border-slate-300 px-4 py-3 font-medium">CCHR (High Risk)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.cchr.recommend ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">100.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">50.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">52.1%</td>
                          </tr>

                          {/* NOC */}
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="border border-slate-300 px-4 py-3 font-medium">NOC (New Orleans)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.noc.recommend ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">99.5%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">8.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">92.3%</td>
                          </tr>

                          {/* NEXUS II */}
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="border border-slate-300 px-4 py-3 font-medium">NEXUS II</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.nexus.recommend ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">98.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">30.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">71.3%</td>
                          </tr>

                          {/* CHIP */}
                          <tr className="bg-white hover:bg-slate-50">
                            <td className="border border-slate-300 px-4 py-3 font-medium">CHIP</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.chip.recommend ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">97.5%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">29.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">72.2%</td>
                          </tr>

                          {/* Divider */}
                          <tr>
                            <td colSpan="5" className="border border-slate-300 bg-slate-200 px-4 py-2 text-center font-semibold text-slate-700">
                              Predictive Model (Various Thresholds)
                            </td>
                          </tr>

                          {/* Your Model - 1% */}
                          <tr className="bg-blue-50 hover:bg-blue-100">
                            <td className="border border-slate-300 px-4 py-3 font-medium">Predictive Model (1%)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.yourModel1 ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">95.2%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">20.8%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">79.8%</td>
                          </tr>

                          {/* Your Model - 2% */}
                          <tr className="bg-blue-50 hover:bg-blue-100">
                            <td className="border border-slate-300 px-4 py-3 font-medium">Predictive Model (2%)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.yourModel2 ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">84.4%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">51.8%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">49.7%</td>
                          </tr>

                          {/* Your Model - 3% */}
                          <tr className="bg-blue-50 hover:bg-blue-100">
                            <td className="border border-slate-300 px-4 py-3 font-medium">Predictive Model (3%)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.yourModel3 ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">82.0%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">57.7%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">44.0%</td>
                          </tr>

                          {/* Your Model - 5% */}
                          <tr className="bg-blue-50 hover:bg-blue-100">
                            <td className="border border-slate-300 px-4 py-3 font-medium">Predictive Model (5%)</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">
                              {cdrResults.yourModel5 ? (
                                <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="w-5 h-5" /> CT Scan
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="w-5 h-5" /> No CT
                                </span>
                              )}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-center">56.2%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">82.8%</td>
                            <td className="border border-slate-300 px-4 py-3 text-center">18.8%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Key Insights */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="font-semibold text-slate-700 mb-3">🔍 Key Insights:</h4>
                      <div className="space-y-2 text-sm text-slate-600">
                        <p><strong>Current Patient Risk:</strong> {riskCalculation.percentage}% ciTBI probability</p>
                        <p><strong>CCHR</strong> balances sensitivity and specificity well (100% sensitive, 50% specific)</p>
                        <p><strong>NOC</strong> is very sensitive (99.5%) but has high CT rate (92.3%)</p>
                        <p><strong>CHIP</strong> provides balanced performance with 97.5% sensitivity</p>
                        <p><strong>Predictive Model</strong> offers flexible risk thresholds to balance sensitivity and CT rates</p>
                      </div>
                    </div>

                    {/* CDR Arbitration */}
                    {(() => {
                      const recommendations = [
                        cdrResults.cchr.recommend,
                        cdrResults.noc.recommend,
                        cdrResults.nexus.recommend,
                        cdrResults.chip.recommend
                      ];
                      const allAgree = recommendations.every(r => r === recommendations[0]);
                      
                      if (!allAgree) {
                        return (
                          <Alert className="bg-orange-50 border-orange-200">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                              <strong>⚠️ CDR Disagreement Detected:</strong> The clinical decision rules do not all agree on the recommendation for this patient. The predictive model provides a continuous risk estimate ({riskCalculation.percentage}%) that can help inform decision-making when CDRs disagree.
                            </AlertDescription>
                          </Alert>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Module 3: Decision Consequence Analyzer */}
          <TabsContent value="module3">
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-2xl text-green-900 flex items-center gap-2">
                  <Calculator className="w-6 h-6" />
                  Module 3: Decision Consequence Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">📈 Threshold-Based Decision Analysis</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Explore the consequences of different risk thresholds for CT imaging decisions.
                  </p>
                </div>

                {/* Threshold Slider */}
                <div className="bg-white p-6 rounded-lg border border-slate-200">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Risk Threshold: {threshold.toFixed(1)}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>1% (High Sensitivity)</span>
                      <span>10% (High Specificity)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{currentMetrics.sensitivity.toFixed(1)}%</p>
                      <p className="text-xs text-slate-600">Sensitivity</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{currentMetrics.specificity.toFixed(1)}%</p>
                      <p className="text-xs text-slate-600">Specificity</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{currentMetrics.ctRate.toFixed(1)}%</p>
                      <p className="text-xs text-slate-600">CT Rate</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{currentMetrics.npv.toFixed(1)}%</p>
                      <p className="text-xs text-slate-600">NPV</p>
                    </div>
                  </div>
                </div>

                {/* Consequences Per 1000 Patients */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">📊 Consequences per 1,000 Patients</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Selective Scanning */}
                    <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                      <h5 className="font-semibold text-blue-700 mb-3">Selective Scanning (Your Model)</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">CT Scans:</span>
                          <span className="font-semibold text-slate-900">{consequences.scans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">ciTBI Detected:</span>
                          <span className="font-semibold text-green-600">{consequences.detected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">ciTBI Missed:</span>
                          <span className="font-semibold text-red-600">{consequences.missed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Number Needed to Scan:</span>
                          <span className="font-semibold text-blue-600">{consequences.nns}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Cost per ciTBI Detected:</span>
                          <span className="font-semibold text-slate-900">${consequences.costPerDetected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Radiation:</span>
                          <span className="font-semibold text-orange-600">{consequences.totalRadiation} mSv</span>
                        </div>
                      </div>
                    </div>

                    {/* Scan All */}
                    <div className="bg-white p-4 rounded-lg border-2 border-slate-300">
                      <h5 className="font-semibold text-slate-700 mb-3">Scan All Strategy</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">CT Scans:</span>
                          <span className="font-semibold text-slate-900">{consequences.scanAll.scans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">ciTBI Detected:</span>
                          <span className="font-semibold text-green-600">{consequences.scanAll.detected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">ciTBI Missed:</span>
                          <span className="font-semibold text-red-600">{consequences.scanAll.missed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Number Needed to Scan:</span>
                          <span className="font-semibold text-blue-600">23.8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Cost:</span>
                          <span className="font-semibold text-slate-900">${consequences.scanAll.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Radiation:</span>
                          <span className="font-semibold text-orange-600">{consequences.scanAll.radiation} mSv</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Parameters */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">⚙️ Adjustable Cost Parameters</h4>
                  <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          CT Scan Cost ($)
                        </label>
                        <input
                          type="number"
                          value={costParams.ctCost}
                          onChange={(e) => setCostParams({...costParams, ctCost: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          ciTBI Treatment Cost ($)
                        </label>
                        <input
                          type="number"
                          value={costParams.ciTBICost}
                          onChange={(e) => setCostParams({...costParams, ciTBICost: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          False Positive Workup ($)
                        </label>
                        <input
                          type="number"
                          value={costParams.fpCost}
                          onChange={(e) => setCostParams({...costParams, fpCost: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Radiation per CT (mSv)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={costParams.radiationPerCT}
                          onChange={(e) => setCostParams({...costParams, radiationPerCT: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-3">💡 Key Insights:</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>• Lower thresholds (1-2%) maximize sensitivity but increase CT scans and costs</p>
                    <p>• Higher thresholds (5-10%) reduce CT rates and radiation but may miss more cases</p>
                    <p>• The optimal threshold depends on your clinical context, resources, and risk tolerance</p>
                    <p>• At {threshold.toFixed(1)}% threshold: {consequences.scans} scans needed to detect {consequences.detected} ciTBI cases</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Footer - UPDATED */}
        <div className="text-center text-sm text-slate-500 space-y-1 py-4">
          <p>⚠️ <strong>Research & Development Only:</strong> This tool is for research and development purposes only.</p>
          <p>NOT intended for use in clinical practice. For educational and validation purposes.</p>
        </div>
      </div>
    </div>
  );
};

export default TBIRiskNavigator;
