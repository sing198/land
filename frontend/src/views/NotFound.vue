<template>
    <div class="not-found">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/" class="home-button">Go Back Home</RouterLink>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound"
  };
  </script>
  
  <style scoped>
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f8f9fa;
    color: #333;
    text-align: center;
  }
  
  .not-found h1 {
    font-size: 100px;
    color: #e63946;
    margin: 0;
  }
  
  .not-found h2 {
    font-size: 24px;
    margin: 10px 0;
    color: #1d3557;
  }
  
  .not-found p {
    font-size: 16px;
    color: #6c757d;
    margin: 20px 0;
  }
  
  .home-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #457b9d;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.3s;
  }
  
  .home-button:hover {
    background-color: #1d3557;
  }
  </style>
  