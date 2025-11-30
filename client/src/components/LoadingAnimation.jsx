import React from 'react';

const LoadingAnimation = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="flex flex-col items-center gap-4">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-64 h-64 object-contain"
                >
                    <source src="/loading.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
                <p className="text-gray-600 text-lg font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingAnimation;
