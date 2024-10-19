export const loadRazorpay = () => {
    return new Promise<any>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve((window as any).Razorpay);
      };
      script.onerror = () => {
        reject(new Error("Razorpay SDK failed to load. Are you online?"));
      };
      document.body.appendChild(script);
    });
  };