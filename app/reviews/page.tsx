"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../../components/Map"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-200 animate-pulse rounded-lg" />,
});

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
          <Image src="/header.png" alt="412eats header" width={300} height={300} />
            <Image src="/logo.png" alt="412eats logo" width={80} height={80} />
          </div>
          <p className="text-xl text-gray-700">Pittsburgh Restaurant Rankings</p>
        </header>

        {restaurants === undefined ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading restaurants...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Map</h2>
              <Map restaurants={restaurants} />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Rankings</h2>
              {restaurants.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No restaurants yet. Add some to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {restaurants
                    .sort((a, b) => {
                      const avgA = calculateAverage(a.ratings);
                      const avgB = calculateAverage(b.ratings);
                      return parseFloat(avgB) - parseFloat(avgA);
                    })
                    .map((restaurant) => (
                      <div
                        key={restaurant._id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-800">
                              {restaurant.restaurant_name}
                            </h3>
                            {restaurant.instagram_reel_link && (
                              <a
                                href={restaurant.instagram_reel_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 hover:text-orange-600 text-sm"
                              >
                                Watch Reel →
                              </a>
                            )}
                          </div>
                          <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                            {calculateAverage(restaurant.ratings)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Food:</span>
                            <span className="font-semibold">{restaurant.ratings.food}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Water:</span>
                            <span className="font-semibold">{restaurant.ratings.water}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Utensils:</span>
                            <span className="font-semibold">{restaurant.ratings.utensils}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Interior:</span>
                            <span className="font-semibold">
                              {restaurant.ratings.interior_design}/10
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-semibold">{restaurant.ratings.location}/10</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vibes:</span>
                            <span className="font-semibold">{restaurant.ratings.vibes}/10</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
