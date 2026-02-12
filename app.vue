<script setup lang="ts">
useSeoMeta({
	title: "Paris Guide for Travelers",
	description: "Welcome to the Paris Guide for Travelers.",
});
</script>

<template>
  <div class="antialiased h-screen overflow-y-auto bg-[#050505] text-white selection:bg-[#FF4D00] selection:text-black">
    <div class="fixed inset-0 pointer-events-none opacity-20 grain-bg"></div>
    <NuxtPage />
  </div>
</template>


<style>
/* Global scroll behavior */
html, body {
  scroll-behavior: smooth;
  overflow: hidden; /* We handle scroll in a container for snapping */
  background: #050505;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.grain-bg {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%32");
}

/* Sharp Reset */
* {
  border-radius: 0 !important;
}

/* Restore some rounding for specific elements where it's intentional */
.rounded-full {
  border-radius: 9999px !important;
}

.rounded-sharp {
  border-radius: 2px !important;
}
</style>

