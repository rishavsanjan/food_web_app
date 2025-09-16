import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, Plus, X, User, Calendar, MapPin, CheckCircle, AlertCircle, Clock, Search, TrendingUp, Award, Heart } from 'lucide-react';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "👩‍💼",
    rating: 5,
    date: "2024-03-15",
    title: "Absolutely Amazing Experience!",
    review: "The food was exceptional and the service was outstanding. The truffle risotto was perfectly cooked and the ambiance was romantic. Will definitely come back for our anniversary!",
    helpful: 24,
    notHelpful: 2,
    verified: true,
    category: "Food Quality",
    visitType: "Date Night",
    photos: ["🍝", "🍷"]
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    avatar: "👨‍💻",
    rating: 4,
    date: "2024-03-12",
    title: "Great food, but service could be better",
    review: "The dishes were delicious, especially the grilled salmon. However, we had to wait quite a bit for our order. The atmosphere is nice though, perfect for business meetings.",
    helpful: 18,
    notHelpful: 5,
    verified: true,
    category: "Service",
    visitType: "Business Meeting",
    photos: ["🐟"]
  },
  {
    id: 3,
    name: "Sneha Patel",
    avatar: "👩‍🎨",
    rating: 5,
    date: "2024-03-10",
    title: "Perfect venue for celebrations!",
    review: "We celebrated my birthday here and it was fantastic! The staff was so accommodating, the food was fresh and flavorful. The birthday dessert surprise was a lovely touch!",
    helpful: 31,
    notHelpful: 1,
    verified: true,
    category: "Ambiance",
    visitType: "Celebration",
    photos: ["🎂", "🥂", "🎉"]
  },
  {
    id: 4,
    name: "Arjun Singh",
    avatar: "👨‍🍳",
    rating: 3,
    date: "2024-03-08",
    title: "Average experience",
    review: "The food was okay but nothing extraordinary. The prices are quite high for what you get. The location is convenient though, and parking was easy.",
    helpful: 12,
    notHelpful: 8,
    verified: false,
    category: "Value",
    visitType: "Casual Dining",
    photos: []
  },
  {
    id: 5,
    name: "Kavya Reddy",
    avatar: "👩‍🎓",
    rating: 4,
    date: "2024-03-05",
    title: "Lovely place for family dinner",
    review: "Brought my parents here for their wedding anniversary. The vegetarian options were excellent, and the staff was very patient with our elderly parents. Highly recommend the margherita pizza!",
    helpful: 27,
    notHelpful: 3,
    verified: true,
    category: "Family Friendly",
    visitType: "Family Dinner",
    photos: ["🍕", "👨‍👩‍👧‍👦"]
  }
];

// Mock restaurant stats
const restaurantStats = {
  overallRating: 4.2,
  totalReviews: 248,
  ratingBreakdown: {
    5: 112,
    4: 89,
    3: 32,
    2: 11,
    1: 4
  },
  categories: {
    "Food Quality": 4.5,
    "Service": 4.0,
    "Ambiance": 4.3,
    "Value": 3.8,
    "Family Friendly": 4.4
  }
};

export default function RestaurantReviews() {
  const [reviews, setReviews] = useState(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState(mockReviews);
  const [showAddReview, setShowAddReview] = useState(false);
  const [filterRating, setFilterRating] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 0,
    title: '',
    review: '',
    category: 'Food Quality',
    visitType: 'Casual Dining'
  });

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews;

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(review => review.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review => 
        review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort reviews
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, filterRating, filterCategory, sortBy, searchTerm]);

  const handleAddReview = () => {
    if (newReview.name && newReview.rating && newReview.title && newReview.review) {
      const review = {
        id: reviews.length + 1,
        ...newReview,
        avatar: "👤",
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        notHelpful: 0,
        verified: false,
        photos: []
      };
      
      setReviews([review, ...reviews]);
      setNewReview({
        name: '',
        rating: 0,
        title: '',
        review: '',
        category: 'Food Quality',
        visitType: 'Casual Dining'
      });
      setShowAddReview(false);
    }
  };

  const handleHelpful = (reviewId, isHelpful) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: isHelpful ? review.helpful + 1 : review.helpful,
            notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ));
  };

  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-400'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingPercentage = (rating) => {
    return (restaurantStats.ratingBreakdown[rating] / restaurantStats.totalReviews) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
            Customer Reviews
          </h1>
          <p className="text-xl text-gray-300">What our customers say about their dining experience</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1">
            {/* Overall Rating Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-6">
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-orange-400 mb-2">
                  {restaurantStats.overallRating}
                </div>
                {renderStars(Math.round(restaurantStats.overallRating), 'w-6 h-6')}
                <p className="text-gray-300 mt-2">
                  Based on {restaurantStats.totalReviews} reviews
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-4">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getRatingPercentage(rating)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-300 w-8">
                      {restaurantStats.ratingBreakdown[rating]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Category Ratings */}
              <div className="border-t border-white/20 pt-6">
                <h3 className="font-semibold mb-4 text-orange-400">Rating by Category</h3>
                <div className="space-y-3">
                  {Object.entries(restaurantStats.categories).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{rating}</span>
                        {renderStars(Math.round(rating))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Review Button */}
            <button
              onClick={() => setShowAddReview(true)}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Write a Review
            </button>
          </div>

          {/* Main Content - Reviews */}
          <div className="lg:col-span-2">
            {/* Filters and Search */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/20 rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="bg-black/20 rounded-xl border border-white/20 text-white py-2 px-3 focus:outline-none focus:border-orange-400"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-black/20 rounded-xl border border-white/20 text-white py-2 px-3 focus:outline-none focus:border-orange-400"
                >
                  <option value="all">All Categories</option>
                  <option value="Food Quality">Food Quality</option>
                  <option value="Service">Service</option>
                  <option value="Ambiance">Ambiance</option>
                  <option value="Value">Value</option>
                  <option value="Family Friendly">Family Friendly</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/20 rounded-xl border border-white/20 text-white py-2 px-3 focus:outline-none focus:border-orange-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-semibold mb-2">No reviews found</h3>
                  <p className="text-gray-400">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{review.avatar}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{review.name}</h4>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-400" title="Verified Customer" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {review.visitType}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {renderStars(review.rating)}
                        <div className="text-sm text-gray-400 mt-1">{review.category}</div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-lg mb-2 text-orange-400">
                        {review.title}
                      </h5>
                      <p className="text-gray-300 leading-relaxed">
                        {review.review}
                      </p>
                    </div>

                    {/* Photos */}
                    {review.photos.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-black/20 rounded-lg flex items-center justify-center text-2xl border border-white/20"
                          >
                            {photo}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleHelpful(review.id, true)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button
                          onClick={() => handleHelpful(review.id, false)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Not Helpful ({review.notHelpful})
                        </button>
                      </div>
                      
                      {review.helpful > 15 && (
                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                          <TrendingUp className="w-4 h-4" />
                          Popular Review
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                    className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400'
                          } hover:text-yellow-300 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category and Visit Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newReview.category}
                      onChange={(e) => setNewReview({...newReview, category: e.target.value})}
                      className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="Food Quality">Food Quality</option>
                      <option value="Service">Service</option>
                      <option value="Ambiance">Ambiance</option>
                      <option value="Value">Value</option>
                      <option value="Family Friendly">Family Friendly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Visit Type
                    </label>
                    <select
                      value={newReview.visitType}
                      onChange={(e) => setNewReview({...newReview, visitType: e.target.value})}
                      className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400"
                    >
                      <option value="Casual Dining">Casual Dining</option>
                      <option value="Date Night">Date Night</option>
                      <option value="Family Dinner">Family Dinner</option>
                      <option value="Business Meeting">Business Meeting</option>
                      <option value="Celebration">Celebration</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400 transition-colors"
                    placeholder="Summarize your experience"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    rows={4}
                    className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400 transition-colors resize-none"
                    placeholder="Tell us about your dining experience..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.name || !newReview.rating || !newReview.title || !newReview.review}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}