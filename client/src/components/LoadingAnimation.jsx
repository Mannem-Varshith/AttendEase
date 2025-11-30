import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingAnimation = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="w-64 h-64">
                <DotLottieReact
                    src="https://lottie.host/4139c4d4-89e7-4322-8b9c-20c2eea38ce6/PG3XXc5elI.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default LoadingAnimation;
