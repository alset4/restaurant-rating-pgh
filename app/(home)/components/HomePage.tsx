"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/layout/Header";
import AboutCard from "./AboutCard";

export default function HomePage() {
    const restaurants = useQuery(api.restaurants.list);
    const router = useRouter();
  
    useEffect(() => {
      const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
      if (!hasSeenIntro) {
        router.push("/intro");
      }
    }, [router]);
  
    const calculateAverage = (ratings: any) => {
      const values = Object.values(ratings) as number[];
      return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    };
  
    const topRestaurants = restaurants
      ?.sort((a, b) => {
        const avgA = parseFloat(calculateAverage(a.ratings));
        const avgB = parseFloat(calculateAverage(b.ratings));
        return avgB - avgA;
      })
      .slice(0, 2) || [];
  
    const topFoodRestaurants = restaurants
      ?.sort((a, b) => b.ratings.food - a.ratings.food)
      .slice(0, 2) || [];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header />
  
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <AboutCard />
  
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">#recent-reviews</h2>
              <Link href="/reviews" className="text-orange-600 hover:text-orange-700 font-medium">
                see all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {restaurants?.slice(0, 3).map((restaurant) => (
                <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{restaurant.restaurant_name}</h3>
                  <div className="text-orange-600 text-2xl font-bold mb-3">
                    {calculateAverage(restaurant.ratings)}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Food: {restaurant.ratings.food}/10</p>
                    <p>Vibes: {restaurant.ratings.vibes}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
  
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800"># current rankings</h2>
              <Link href="/rankings" className="text-orange-600 hover:text-blue-700 font-medium">
                see all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Top Overall</h3>
                <div className="space-y-3">
                  {topRestaurants.map((restaurant, idx) => (
                    <div key={restaurant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-500">{idx + 1}.</span>
                        <span className="font-medium">{restaurant.restaurant_name}</span>
                      </div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {calculateAverage(restaurant.ratings)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Top Food</h3>
                <div className="space-y-3">
                  {topFoodRestaurants.map((restaurant, idx) => (
                    <div key={restaurant._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-500">{idx + 1}.</span>
                        <span className="font-medium">{restaurant.restaurant_name}</span>
                      </div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {restaurant.ratings.food}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
  
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 412eats. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
  