import React from 'react'

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow rounded-lg px-8 py-12 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">AGRITECH</h1>
        <h2 className="text-xl text-center mb-4">Welcome back</h2>
        <form className="space-y-4">
          <div className="flex items-center">
            <label htmlFor="email" className="w-1/3 mr-2 text-sm font-medium">Email address</label>
            <input type="email" id="email" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="name@company.com" />
          </div>
          <div className="flex items-center">
            <label htmlFor="password" className="w-1/3 mr-2 text-sm font-medium">Password</label>
          <input type="password" id="password" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm font-medium">Remember me</label>
            </div>
            <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700">Log in</button>
          <div className="flex justify-center mt-4">
            <a href="#" className="text-sm text-blue-500 hover:underline">Log in with Google</a>
          </div>
        </form>
        <p className="text-sm text-center mt-6">Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up here</a></p>
      </div>
    </div>
  )
}

export default Login
