import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  restaurants: defineTable({
    restaurant_name: v.string(),
    instagram_reel_link: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  }),
  ratings: defineTable({
    restaurant_id: v.id("restaurants"),
    reviewer: v.union(v.literal("Derek"), v.literal("Alek"), v.literal("Brandon")),
    food: v.number(),
    water: v.number(),
    utensils: v.number(),
    interior_design: v.number(),
    location: v.number(),
    vibes: v.number(),
  }).index("by_restaurant", ["restaurant_id"]),
});
