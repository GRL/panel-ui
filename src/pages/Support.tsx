import React, { useEffect } from 'react';

const ChatwootLoader = () => {
    useEffect(() => {
        const loadChatwoot = () => {
            const BASE_URL = "https://chat.g-r-l.com";
            const script = document.createElement('script');
            script.src = `${BASE_URL}/packs/js/sdk.js`;
            script.defer = true;
            script.async = true;

            script.onload = () => {
                if (window.chatwootSDK) {
                    window.chatwootSDK.run({
                        websiteToken: 'dEEw3fcexQvnQ5tesJPKFjSb',
                        baseUrl: BASE_URL,
                    });
                }
            };

            document.body.appendChild(script);
        };

        loadChatwoot();

        // Clean up script when the component unmounts
        return () => {
            const existingScript = document.querySelector(`script[src="https://app.chatwoot.com/packs/js/sdk.js"]`);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    return null;
};

export {ChatwootLoader};