
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PredictionResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  probability: number;
  waveHeight: number;
  arrivalTime: number;
}

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    magnitude: '',
    depth: '',
    datetime: ''
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulatePrediction = async (): Promise<PredictionResult> => {
    // Simulate AI prediction based on input data
    const mag = parseFloat(formData.magnitude);
    const depth = parseFloat(formData.depth);
    
    let riskLevel: PredictionResult['riskLevel'] = 'LOW';
    let probability = Math.random() * 30;
    let waveHeight = Math.random() * 2;
    
    if (mag >= 7.5 && depth <= 50) {
      riskLevel = 'EXTREME';
      probability = 75 + Math.random() * 20;
      waveHeight = 5 + Math.random() * 10;
    } else if (mag >= 7.0 && depth <= 70) {
      riskLevel = 'HIGH';
      probability = 50 + Math.random() * 25;
      waveHeight = 3 + Math.random() * 5;
    } else if (mag >= 6.5 && depth <= 100) {
      riskLevel = 'MEDIUM';
      probability = 25 + Math.random() * 25;
      waveHeight = 1 + Math.random() * 3;
    }
    
    return {
      riskLevel,
      probability: Math.round(probability),
      waveHeight: Math.round(waveHeight * 10) / 10,
      arrivalTime: Math.round(15 + Math.random() * 120) // 15-135 minutes
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude || !formData.magnitude || !formData.depth) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await simulatePrediction();
      setPrediction(result);
      toast.success("Tsunami risk analysis completed");
    } catch (error) {
      toast.error("Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-cosmic-green';
      case 'MEDIUM': return 'text-yellow-400';
      case 'HIGH': return 'text-orange-400';
      case 'EXTREME': return 'text-red-400';
      default: return 'text-cosmic-silver';
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-orbitron font-bold neon-text mb-4">
          Tsunami Risk Prediction
        </h2>
        <p className="text-cosmic-silver font-space text-lg">
          Enter earthquake parameters for AI-powered tsunami risk analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-cosmic-green">Seismic Data Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-cosmic-silver font-space">
                    Latitude *
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.0001"
                    placeholder="-90 to 90"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    className="bg-cosmic-black border-cosmic-blue text-cosmic-silver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-cosmic-silver font-space">
                    Longitude *
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="-180 to 180"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    className="bg-cosmic-black border-cosmic-blue text-cosmic-silver"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="magnitude" className="text-cosmic-silver font-space">
                    Magnitude *
                  </Label>
                  <Input
                    id="magnitude"
                    type="number"
                    step="0.1"
                    placeholder="4.0 - 9.5"
                    value={formData.magnitude}
                    onChange={(e) => handleInputChange('magnitude', e.target.value)}
                    className="bg-cosmic-black border-cosmic-blue text-cosmic-silver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth" className="text-cosmic-silver font-space">
                    Depth (km) *
                  </Label>
                  <Input
                    id="depth"
                    type="number"
                    step="0.1"
                    placeholder="0 - 700"
                    value={formData.depth}
                    onChange={(e) => handleInputChange('depth', e.target.value)}
                    className="bg-cosmic-black border-cosmic-blue text-cosmic-silver"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="datetime" className="text-cosmic-silver font-space">
                  Date & Time (Optional)
                </Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => handleInputChange('datetime', e.target.value)}
                  className="bg-cosmic-black border-cosmic-blue text-cosmic-silver"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cosmic-button"
              >
                {isLoading ? "Analyzing Seismic Data..." : "Generate Prediction"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Prediction Results */}
        <Card className="space-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-cosmic-green">Tsunami Risk Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-6xl font-orbitron font-bold mb-2 ${getRiskColor(prediction.riskLevel)}`}>
                    {prediction.riskLevel}
                  </div>
                  <div className="text-cosmic-silver font-space">Risk Level</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-cosmic-black rounded-lg">
                    <div className="text-2xl font-orbitron text-cosmic-green">
                      {prediction.probability}%
                    </div>
                    <div className="text-sm text-cosmic-silver">Probability</div>
                  </div>
                  <div className="text-center p-4 bg-cosmic-black rounded-lg">
                    <div className="text-2xl font-orbitron text-cosmic-blue">
                      {prediction.waveHeight}m
                    </div>
                    <div className="text-sm text-cosmic-silver">Wave Height</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-cosmic-black rounded-lg">
                  <div className="text-2xl font-orbitron text-cosmic-purple">
                    {prediction.arrivalTime} min
                  </div>
                  <div className="text-sm text-cosmic-silver">Estimated Arrival Time</div>
                </div>

                {/* Wave level indicator */}
                <div className="relative h-24 bg-cosmic-black rounded-lg overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cosmic-blue to-cosmic-blue/30 animate-wave-animation"
                       style={{ height: `${Math.min(prediction.waveHeight * 10, 100)}%` }}>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-cosmic-silver font-space font-medium">
                      Wave Simulation
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-cosmic-silver font-space text-lg mb-4">
                  Enter seismic parameters to generate tsunami risk prediction
                </div>
                <div className="text-cosmic-green/60 font-mono text-sm">
                  AI Model Ready • Satellite Data Connected
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PredictionForm;
