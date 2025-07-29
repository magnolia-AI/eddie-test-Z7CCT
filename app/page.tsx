'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl mb-6">
            Weather Forecast Site
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-[600px] mx-auto mb-10">
            Get detailed weather information, forecasts, and alerts for any location worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/weather">
              <Button size="lg" className="text-lg px-8 py-6">
                <Cloud className="mr-2 h-6 w-6" />
                Check Weather
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <Thermometer className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Current Conditions</h3>
                <p className="text-muted-foreground">
                  Real-time temperature, humidity, and pressure readings
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <Droplets className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">7-Day Forecast</h3>
                <p className="text-muted-foreground">
                  Detailed predictions for the week ahead with precipitation chances
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6">
                <Wind className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">Weather Alerts</h3>
                <p className="text-muted-foreground">
                  Receive notifications about severe weather conditions in your area
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
                <p className="text-muted-foreground">
                  Get weather information for any city in the world with accurate geolocation
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Detailed Forecasts</h3>
                <p className="text-muted-foreground">
                  Hourly forecasts for the next 24 hours and 7-day predictions
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Beautiful Design</h3>
                <p className="text-muted-foreground">
                  Dynamic backgrounds and weather-appropriate themes for an immersive experience
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Mobile Optimized</h3>
                <p className="text-muted-foreground">
                  Fully responsive design that works perfectly on all devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>);

}
