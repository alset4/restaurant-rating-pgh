import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const restaurants = await ctx.db.query("restaurants").collect();

    const restaurantsWithRatings = await Promise.all(
      restaurants.map(async (restaurant) => {
        const ratings = await ctx.db
          .query("ratings")
          .withIndex("by_restaurant", (q) => q.eq("restaurant_id", restaurant._id))
          .collect();

        const averageRatings = {
          food: 0,
          water: 0,
          utensils: 0,
          interior_design: 0,
          location: 0,
          vibes: 0,
        };

        if (ratings.length > 0) {
          averageRatings.food = ratings.reduce((sum, r) => sum + r.food, 0) / ratings.length;
          averageRatings.water = ratings.reduce((sum, r) => sum + r.water, 0) / ratings.length;
          averageRatings.utensils = ratings.reduce((sum, r) => sum + r.utensils, 0) / ratings.length;
          averageRatings.interior_design = ratings.reduce((sum, r) => sum + r.interior_design, 0) / ratings.length;
          averageRatings.location = ratings.reduce((sum, r) => sum + r.location, 0) / ratings.length;
          averageRatings.vibes = ratings.reduce((sum, r) => sum + r.vibes, 0) / ratings.length;
        }

        return {
          ...restaurant,
          ratings: averageRatings,
          individualRatings: ratings,
        };
      })
    );

    return restaurantsWithRatings;
  },
});

export const add = mutation({
  args: {
    restaurant_name: v.string(),
    instagram_reel_link: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("restaurants", args);
  },
});

export const addRating = mutation({
  args: {
    restaurant_id: v.id("restaurants"),
    reviewer: v.union(v.literal("Derek"), v.literal("Alek"), v.literal("Brandon")),
    food: v.number(),
    water: v.number(),
    utensils: v.number(),
    interior_design: v.number(),
    location: v.number(),
    vibes: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ratings", args);
  },
});
