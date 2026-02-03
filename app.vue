<script setup lang="ts">
useSeoMeta({
	title: "Paris Guide for Travelers",
	description: "Welcome to the Paris Guide for Travelers.",
});
</script>

<template>
  <div class="antialiased h-screen overflow-y-auto bg-gray-950 text-white bg-gradient-apple selection:bg-pink-500 selection:text-white">
    <NuxtPage />
  </div>
</template>


<style>
/* Global scroll behavior */
html, body {
  scroll-behavior: smooth;
  overflow: hidden; /* We handle scroll in a container for snapping */
  background: #000;
}

/* Apple-style mesh gradient background */
.bg-gradient-apple {
  background: 
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
  background-size: 200% 200%;
  animation: mesh 15s ease infinite;
}

@keyframes mesh {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>

