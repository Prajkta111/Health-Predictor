'use client';

import { useState } from 'react';
import { useAuth, usePredictionHistory } from '@/hooks/use-auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Save, History, Lock, Info } from 'lucide-react';
import Link from 'next/link';

interface PredictionWithAuthProps {
  prediction?: any;
  onSave?: () => void;
}

export function PredictionWithAuth({ prediction, onSave }: PredictionWithAuthProps) {
  const { isAuthenticated, user } = useAuth();
  const { savePrediction, history, isLoading } = usePredictionHistory();
  const [saveMessage, setSaveMessage] = useState('');

  const handleSavePrediction = async () => {
    if (!prediction) return;

    if (!isAuthenticated) {
      setSaveMessage('Please sign in to save predictions');
      return;
    }

    await savePrediction(prediction);
    setSaveMessage('Prediction saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
    onSave?.();
  };

  return (
    <div className="space-y-4">
      {/* Authentication Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {isAuthenticated ? (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                Signed in as {user?.name || user?.email}
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-gray-400 rounded-full" />
                Anonymous user
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Save className="h-4 w-4" />
              Predictions are automatically saved
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Lock className="h-4 w-4" />
                Sign in to save your prediction history
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Prediction Action */}
      {prediction && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Prediction Result</h3>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? "Saveable" : "Temporary"}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <div>Model: {prediction.model}</div>
                <div>Prediction: {prediction.prediction}</div>
                {prediction.confidence && (
                  <div>Confidence: {(prediction.confidence * 100).toFixed(1)}%</div>
                )}
              </div>

              <Button 
                onClick={handleSavePrediction}
                disabled={!isAuthenticated || isLoading}
                size="sm"
                className="w-full"
              >
                {isLoading ? (
                  'Saving...'
                ) : isAuthenticated ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Prediction
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Sign in to Save
                  </>
                )}
              </Button>

              {saveMessage && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>{saveMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Preview */}
      {isAuthenticated && history.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" />
              Recent Predictions ({history.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {history.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.model}</span>
                  <Badge variant="outline" className="text-xs">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
              {history.length > 3 && (
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <Link href="/history">View all {history.length} predictions →</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pro Features Preview */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Heart className="h-8 w-8 mx-auto text-pink-500" />
            <h3 className="font-medium">Pro Features Coming Soon</h3>
            <p className="text-sm text-gray-600">
              Advanced analytics, export options, and priority support
            </p>
            <Button size="sm" variant="outline" disabled>
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
