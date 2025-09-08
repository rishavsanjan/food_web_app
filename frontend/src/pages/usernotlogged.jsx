import React, { useState } from 'react';
import { CheckCircle, Info, Heart, Target, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from "react-router-dom";

export default function OurInfo() {
    const [expandedCard, setExpandedCard] = useState(null);

    const toggleCard = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    const differentiators = [
        {
            icon: <Info className="h-8 w-8" />,
            title: "Nutritional Transparency",
            subtitle: "Know what you're eating",
            description: "We display key details like calories, protein, fat, fiber, and other essential nutrients for informed decision-making.",
            features: ["Detailed calorie counts", "Macro breakdown (protein, carbs, fats)", "Micronutrient information", "Allergen warnings"],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Target className="h-8 w-8" />,
            title: "Ingredient Breakdown",
            subtitle: "See what's in your food",
            description: "Users can see what's in their food before ordering, ensuring they pick meals that suit their dietary needs.",
            features: ["Complete ingredient lists", "Source information", "Preparation methods", "Freshness indicators"],
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Health-Conscious Choices",
            subtitle: "Meals that align with your goals",
            description: "Our platform helps users choose meals that align with their fitness goals, dietary restrictions, or personal preferences.",
            features: ["Dietary filters (vegan, keto, etc.)", "Fitness goal alignment", "Restriction compatibility", "Wellness recommendations"],
            color: "from-pink-500 to-rose-500"
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Smarter Food Selection",
            subtitle: "AI-powered recommendations",
            description: "Whether you're looking for high-protein meals, low-carb options, or fiber-rich dishes, our app guides you to the best choices.",
            features: ["Personalized suggestions", "Goal-based filtering", "Smart meal planning", "Nutritional scoring"],
            color: "from-purple-500 to-violet-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">QuickBite</h1>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        What are we doing <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">different?</span>
                    </h2>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-xl text-purple-200 leading-relaxed mb-8">
                            Most food ordering platforms focus only on convenience—allowing users to browse menus
                            and place orders quickly. However, they often lack detailed information about the food itself.
                            Our platform takes a step further by providing <span className="text-orange-400 font-semibold">essential nutritional insights</span> for every dish.
                        </p>
                    </div>
                </div>

                {/* Key Differentiators Title */}
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold text-white mb-4">Key Differentiators:</h3>
                </div>

                {/* Differentiators Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {differentiators.map((item, index) => (
                        <div key={index} className="group">
                            <div className="bg-purple-600 backdrop-blur-lg rounded-3xl p-8 border border-purple-800 border-opacity-20 shadow-2xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                onClick={() => toggleCard(index)}>

                                {/* Icon and Check */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-8 w-8 text-green-400 mr-4 flex-shrink-0" />
                                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="text-purple-300 group-hover:text-white transition-colors duration-200">
                                        {expandedCard === index ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="ml-12">
                                    <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                                    <p className="text-orange-400 font-medium mb-4">{item.subtitle}</p>
                                    <p className="text-purple-200 leading-relaxed">{item.description}</p>

                                    {/* Expanded Features */}
                                    {expandedCard === index && (
                                        <div className="mt-6 space-y-3 animate-in slide-in-from-top duration-300">
                                            <h5 className="text-lg font-semibold text-white">Key Features:</h5>
                                            <div className="grid grid-cols-1 gap-2">
                                                {item.features.map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center">
                                                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                                                        <span className="text-purple-200">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Section */}
                <div className="bg-purple-600   backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-purple-600 border-opacity-20 shadow-2xl text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        Experience the <span className="text-orange-400">QuickBite Difference</span>
                    </h3>
                    <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
                        Make informed food choices with detailed nutritional insights, ingredient transparency,
                        and personalized recommendations that align with your health goals.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to={'/login'}>
                            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                                Try QuickBite Now
                            </button>
                        </Link>

                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-32 left-16 text-4xl opacity-20 animate-bounce">🥗</div>
                <div className="absolute top-64 right-20 text-3xl opacity-20 animate-pulse">📊</div>
                <div className="absolute bottom-32 left-12 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>💪</div>
                <div className="absolute bottom-48 right-16 text-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.3s' }}>🎯</div>
            </div>
        </div>
    );
}