// Test file for dynamic component compilation
import { compileAndRegisterComponent, getDynamicComponent, type GeneratedComponent } from './dynamic-component-compiler';

// Test component code
const testLoginFormCode = `
import React, { useState } from 'react';

export function LoginForm({ title = "Login", onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
`;

const testProductCardCode = `
import React from 'react';

export function ProductCard({ title, description, price, imageUrl }) {
  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">${price}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
`;

export function testDynamicComponents() {
  console.log('Testing dynamic component compilation...');

  // Test 1: Login Form
  const loginFormComponent: GeneratedComponent = {
    type: 'login-form',
    category: 'ui',
    props: {
      title: 'User Login',
      onSubmit: (data: any) => console.log('Login submitted:', data)
    },
    code: testLoginFormCode
  };

  const loginSuccess = compileAndRegisterComponent(loginFormComponent);
  console.log('Login form compilation:', loginSuccess ? 'SUCCESS' : 'FAILED');

  // Test 2: Product Card
  const productCardComponent: GeneratedComponent = {
    type: 'product-card',
    category: 'ui',
    props: {
      title: 'Sample Product',
      description: 'This is a sample product description',
      price: 99.99,
      imageUrl: '/placeholder.jpg'
    },
    code: testProductCardCode
  };

  const productSuccess = compileAndRegisterComponent(productCardComponent);
  console.log('Product card compilation:', productSuccess ? 'SUCCESS' : 'FAILED');

  // Test 3: Retrieve components
  const LoginForm = getDynamicComponent('login-form');
  const ProductCard = getDynamicComponent('product-card');

  console.log('LoginForm component retrieved:', !!LoginForm);
  console.log('ProductCard component retrieved:', !!ProductCard);

  return {
    loginForm: LoginForm,
    productCard: ProductCard,
    loginSuccess,
    productSuccess
  };
}

// Export test components for manual testing
export const testComponents = {
  loginForm: {
    type: 'login-form',
    category: 'ui',
    props: {
      title: 'User Login',
      onSubmit: (data: any) => console.log('Login submitted:', data)
    },
    code: testLoginFormCode
  },
  productCard: {
    type: 'product-card',
    category: 'ui',
    props: {
      title: 'Sample Product',
      description: 'This is a sample product description',
      price: 99.99,
      imageUrl: '/placeholder.jpg'
    },
    code: testProductCardCode
  }
}; 