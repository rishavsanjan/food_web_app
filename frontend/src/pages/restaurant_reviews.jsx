import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, Plus, X, User, Calendar, MapPin, CheckCircle, AlertCircle, Clock, Search, TrendingUp, Award, Heart } from 'lucide-react';
import axios from 'axios';
import config from '../config/config';
import { ToastContainer, toast } from 'react-toastify';
import { useUser } from '../contexts/userContext';
import Lottie from "lottie-react";
import loadingAnimation from '../../assets/loading-animation/purple_loading.json'

export default function RestaurantReviews({ reviews, setReviews, restaurantId, selfReview, setSelfReview }) {
    const [showAddReview, setShowAddReview] = useState(false);
    const { user } = useUser();
    const [newReview, setNewReview] = useState({
        rating: 0,
        review: '',
    });
    const [loading, setLoading] = useState(false);


    // const getReviews = async () => {
    //     const token = localStorage.getItem('token');
    //     try {
    //         const response = await axios({
    //             url: `${config.apiUrl}/api/restaurant/${restaurantId}/reviews`, // Add proper URL
    //             method: 'get',
    //             headers: {
    //                 'Authorization': 'Bearer ' + token
    //             }
    //         });
    //         setReviews(response.data);
    //     } catch (error) {
    //         console.error('Error fetching reviews:', error);
    //     }
    // }

    // useEffect(() => {
    //     if (restaurantId) {
    //         getReviews();
    //     }
    // }, [restaurantId])

    const handleAddReview = async () => {
        if (newReview.rating === 0 || newReview.review.trim() === '') {
            toast.error('Please provide both rating and review text');
            return;
        }
        setLoading(true)

        const token = localStorage.getItem('token');
        try {
            const response = await axios({
                url: `${config.apiUrl}/api/users/review`,
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    id_restaurant: restaurantId,
                    rating: newReview.rating,
                    review: newReview.review
                }
            });

            console.log(response.data);

            const newReviewObj = {
                id: Date.now(), // temporary ID
                rating: newReview.rating,
                review_text: newReview.review,
                created_at: new Date().toISOString(),
                users: {
                    name: user.name
                },
                verified: false
            };

            setSelfReview(newReviewObj)
            setNewReview({
                rating: 0,
                review: '',
            });
            setShowAddReview(false);
            toast.success('Review added successfully!');
            setLoading(false);
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add review');
            setLoading(false);
        }
    };

    const renderStars = (rating, size = 'w-4 h-4') => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const RenderReview = ({ review }) => {
        return (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">

                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl">
                            <img className='w-10 h-10' src="https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000" alt="User avatar" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-lg">{review.users?.name || user.name}</h4>
                                {review.verified && (
                                    <CheckCircle className="w-4 h-4 text-green-400" title="Verified Customer" />
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm text-gray-300">
                                    {new Date(review.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {renderStars(review.rating)}
                    </div>
                </div>

                {/* Review Content */}
                <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed">
                        {review.review_text}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                limit={3}
            />
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                        Customer Reviews
                    </h1>
                    <p className="text-xl text-gray-300">What our customers say about their experience</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Sidebar - Stats */}
                    <div className="lg:col-span-1">
                        {/* Overall Rating Card */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 mb-6">
                            {/* Rating stats would go here */}
                        </div>

                        {/* Self Review Display */}
                        {selfReview ? (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
                                <h3 className="text-lg font-semibold mb-4 text-orange-400">Your Review</h3>
                                <RenderReview review={selfReview} />
                            </div>
                        )
                            :
                            <>
                                {/* Add Review Button */}
                                <button
                                    onClick={() => setShowAddReview(true)}
                                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-4 rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <Plus className="w-5 h-5" />
                                    Write a Review
                                </button>
                            </>


                        }



                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-2xl font-semibold mb-2">No reviews found</h3>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <RenderReview key={review.id} review={review} />
                            ))
                        )}
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
                                {/* Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className="p-1"
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${star <= newReview.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-400'
                                                        } hover:text-yellow-300 transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Review Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        value={newReview.review}
                                        onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 bg-black/20 rounded-xl border border-white/20 text-white focus:outline-none focus:border-orange-400 transition-colors resize-none"
                                        placeholder="Tell us about your dining experience..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleAddReview}
                                    disabled={newReview.rating === 0 || newReview.review.length < 10}
                                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {
                                        loading ?
                                            <div className="flex flex-row justify-center items-center   bg-transparent">
                                                <Lottie
                                                    animationData={loadingAnimation}
                                                    loop={true}
                                                    style={{ width: 40, height: 40 }}
                                                />
                                                <h1 className='text-xl font-semibold'>Submitting </h1>
                                            </div>
                                            :
                                            'Submit'
                                    }
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