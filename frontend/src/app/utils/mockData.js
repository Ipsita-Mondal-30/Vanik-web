function seedMockData() {
  const existingPosts = localStorage.getItem("vanik_posts");
  if (existingPosts && JSON.parse(existingPosts).length > 0) {
    return;
  }
  const mockFarmers = [
    { id: "farmer1", name: "Rajesh Kumar", email: "rajesh@example.com", role: "farmer" },
    { id: "farmer2", name: "Amit Patel", email: "amit@example.com", role: "farmer" },
    { id: "farmer3", name: "Suresh Singh", email: "suresh@example.com", role: "farmer" }
  ];
  const mockPosts = [
    {
      id: "post1",
      title: "Fresh Wheat - 50 Quintal",
      description: "High quality wheat from Punjab. Just harvested last week. No pesticides used in last month. Looking for bulk buyers.",
      price: "2000",
      farmerId: "farmer1",
      farmerName: "Rajesh Kumar",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
      // 2 days ago
    },
    {
      id: "post2",
      title: "Organic Tomatoes - Fresh Harvest",
      description: "Premium quality organic tomatoes. Red, ripe and ready for market. 100 kg available.",
      price: "40",
      farmerId: "farmer2",
      farmerName: "Amit Patel",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
      // 5 days ago
    },
    {
      id: "post3",
      title: "Need Harvesting Help - 2 Workers",
      description: "Looking for 2 experienced workers for wheat harvesting. Work duration: 5-7 days. Food and accommodation provided.",
      price: "",
      farmerId: "farmer1",
      farmerName: "Rajesh Kumar",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
      // 1 day ago
    },
    {
      id: "post4",
      title: "Rice Seeds - Premium Quality",
      description: "Basmati rice seeds for plantation. 20 kg bags available. Certified seeds with high yield guarantee.",
      price: "500",
      farmerId: "farmer3",
      farmerName: "Suresh Singh",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
      // 3 days ago
    },
    {
      id: "post5",
      title: "Onions - Bulk Sale",
      description: "Fresh onions available for bulk purchase. 500 kg stock. Good quality, no damage.",
      price: "25",
      farmerId: "farmer2",
      farmerName: "Amit Patel",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3).toISOString()
      // 4 days ago
    }
  ];
  const mockBuyers = [
    { id: "buyer1", name: "Vikram Sharma", email: "vikram@example.com", role: "buyer" },
    { id: "buyer2", name: "Priya Reddy", email: "priya@example.com", role: "buyer" }
  ];
  const mockBids = [
    {
      id: "bid1",
      postId: "post1",
      buyerId: "buyer1",
      buyerName: "Vikram Sharma",
      amount: "1900",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "bid2",
      postId: "post1",
      buyerId: "buyer2",
      buyerName: "Priya Reddy",
      amount: "2100",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "bid3",
      postId: "post2",
      buyerId: "buyer1",
      buyerName: "Vikram Sharma",
      amount: "45",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "bid4",
      postId: "post3",
      buyerId: "buyer2",
      buyerName: "Priya Reddy",
      amount: "800",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString()
    }
  ];
  localStorage.setItem("vanik_posts", JSON.stringify(mockPosts));
  localStorage.setItem("vanik_bids", JSON.stringify(mockBids));
}
export {
  seedMockData
};
