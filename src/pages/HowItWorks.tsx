
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Satellite, Arrow-Down, Circle-Arrow-Right } from "lucide-react";

const HowItWorks = () => {
  const workflowSteps = [
    {
      title: "Satellite Data Collection",
      description: "Advanced Earth observation satellites continuously monitor seismic activity and ocean conditions across the globe.",
      icon: Satellite,
      details: [
        "Real-time seismic wave detection",
        "Ocean surface displacement monitoring", 
        "Multi-spectral imaging analysis",
        "GPS-based ground movement tracking"
      ]
    },
    {
      title: "Data Processing & Fusion",
      description: "Raw satellite data is processed and combined with ground-based sensor networks for comprehensive analysis.",
      icon: Arrow-Down,
      details: [
        "Signal filtering and noise reduction",
        "Multi-source data integration",
        "Real-time quality assessment",
        "Historical data correlation"
      ]
    },
    {
      title: "AI Model Analysis",
      description: "Deep learning models trained on historical tsunami events analyze patterns and predict risk levels.",
      icon: Circle-Arrow-Right,
      details: [
        "Neural network pattern recognition",
        "Risk probability calculation",
        "Wave propagation modeling",
        "Coastal impact assessment"
      ]
    },
    {
      title: "Alert Generation",
      description: "Automated systems generate and distribute tsunami warnings to affected coastal regions worldwide.",
      icon: Satellite,
      details: [
        "Real-time alert distribution",
        "Multi-channel communication",
        "Risk level classification",
        "Evacuation route planning"
      ]
    }
  ];

  const modelFeatures = [
    {
      title: "Deep Neural Networks",
      description: "Multi-layer neural networks process complex seismic patterns",
      accuracy: "94.2%"
    },
    {
      title: "Ensemble Learning",
      description: "Multiple models work together for improved predictions",
      accuracy: "91.8%"
    },
    {
      title: "Real-time Processing",
      description: "Sub-minute analysis of incoming satellite data",
      accuracy: "96.3%"
    },
    {
      title: "Continuous Learning",
      description: "Models update automatically with new earthquake data",
      accuracy: "89.7%"
    }
  ];

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <div className="space-grid min-h-screen">
        <Navigation />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-orbitron font-bold neon-text mb-4">
                How It Works
              </h1>
              <p className="text-cosmic-silver font-space text-lg max-w-3xl mx-auto">
                Understanding the technology behind satellite-assisted tsunami prediction
              </p>
            </div>

            {/* System Overview */}
            <div className="mb-16">
              <Card className="space-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-cosmic-green text-center text-2xl">
                    Satellite + AI Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Central Earth */}
                    <div className="flex justify-center mb-12">
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-cosmic-blue to-cosmic-blue-dark border-4 border-cosmic-green/50">
                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cosmic-blue via-cosmic-blue-dark to-cosmic-black opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-cosmic-green font-orbitron font-bold text-sm">EARTH</span>
                        </div>
                      </div>
                    </div>

                    {/* Orbiting Elements */}
                    <div className="grid md:grid-cols-4 gap-8">
                      {workflowSteps.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="mb-4 flex justify-center">
                            <div className="w-16 h-16 bg-cosmic-black-light rounded-full flex items-center justify-center border-2 border-cosmic-green">
                              <step.icon className="w-8 h-8 text-cosmic-green" />
                            </div>
                          </div>
                          <h3 className="font-orbitron text-cosmic-green mb-2 text-lg">
                            {step.title}
                          </h3>
                          <p className="text-cosmic-silver font-space text-sm mb-4">
                            {step.description}
                          </p>
                          <ul className="space-y-1">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="text-cosmic-silver/70 font-space text-xs">
                                • {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Model Details */}
            <div className="mb-16">
              <h2 className="text-3xl font-orbitron font-bold text-cosmic-green text-center mb-8">
                AI Model Architecture
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {modelFeatures.map((feature, index) => (
                  <Card key={index} className="space-card">
                    <CardHeader>
                      <CardTitle className="font-orbitron text-cosmic-green text-lg">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cosmic-silver font-space mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-cosmic-silver/70 font-space text-sm">Accuracy</span>
                        <span className="text-cosmic-green font-orbitron font-bold text-xl">
                          {feature.accuracy}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-16">
              <Card className="space-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-cosmic-green text-center text-2xl">
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <h3 className="font-orbitron text-cosmic-blue mb-4">Data Sources</h3>
                      <ul className="space-y-2 text-cosmic-silver font-space text-sm">
                        <li>• 15+ Earth observation satellites</li>
                        <li>• Global seismic networks</li>
                        <li>• Ocean buoy systems</li>
                        <li>• GPS ground stations</li>
                        <li>• Historical earthquake database</li>
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-orbitron text-cosmic-blue mb-4">Processing Power</h3>
                      <ul className="space-y-2 text-cosmic-silver font-space text-sm">
                        <li>• 1,024 GPU cluster</li>
                        <li>• 500TB data storage</li>
                        <li>• Sub-minute processing</li>
                        <li>• 99.9% uptime</li>
                        <li>• Global distribution</li>
                      </ul>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-orbitron text-cosmic-blue mb-4">Model Performance</h3>
                      <ul className="space-y-2 text-cosmic-silver font-space text-sm">
                        <li>• 94.2% overall accuracy</li>
                        <li>• <30 second response time</li>
                        <li>• 12,847 training samples</li>
                        <li>• Continuous learning</li>
                        <li>• Multi-language alerts</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Future Developments */}
            <div>
              <Card className="space-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-cosmic-green text-center text-2xl">
                    Future Developments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-orbitron text-cosmic-blue mb-4">Next Generation Features</h3>
                      <ul className="space-y-3 text-cosmic-silver font-space">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-green rounded-full mt-2" />
                          <span>Quantum computing integration for faster processing</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-green rounded-full mt-2" />
                          <span>Advanced satellite constellation with microsecond precision</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-green rounded-full mt-2" />
                          <span>AI-powered evacuation route optimization</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-green rounded-full mt-2" />
                          <span>Personalized risk assessment for coastal properties</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-orbitron text-cosmic-blue mb-4">Research Partnerships</h3>
                      <ul className="space-y-3 text-cosmic-silver font-space">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2" />
                          <span>NASA Earth Science Division collaboration</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2" />
                          <span>European Space Agency joint missions</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2" />
                          <span>NOAA tsunami research program</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-cosmic-purple rounded-full mt-2" />
                          <span>International tsunami warning consortiums</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HowItWorks;
