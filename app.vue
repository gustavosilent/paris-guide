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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  --bg-primary: #0A0A0A;
  --accent-cyan: #00F0FF;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-primary);
  margin: 0;
  padding: 0;
}

/* Technical Minimalism Background */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 50% 50%, rgba(20, 20, 20, 1) 0%, rgba(10, 10, 10, 1) 100%);
  z-index: -1;
}

/* Global Reset for Sharp Edges - Technical Aesthetic */
*, *::before, *::after {
  border-radius: 0 !important;
}

/* Exception for very specific rounded elements if any, but in Technical Minimalism, 0 is king */
.rounded-full {
  border-radius: 9999px !important;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
</style>
