<template>
  <div id="app">
    <!-- The router-view is where the component is injected based on the route -->
    <router-view />
  </div>
</template>

<script>
// Importing Vue Router's `router-view` will handle which component to render based on the route
export default {
  name: 'App',
};
</script>

<style>
/* Add global styles here */
</style>
