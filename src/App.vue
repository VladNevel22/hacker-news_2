<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import { useNewsStore } from '/stores/news'
import { attachRippleEffect, injectRippleStyles } from './utils/rippleEffect'

const newsStore = useNewsStore()
let intervalId = null

onMounted(async () => {
	newsStore.fetchNews()
	intervalId = setInterval(() => {
		newsStore.fetchNews()
	}, 60000)

	// Включаем ripple эффект
	injectRippleStyles()
	await nextTick()
	attachRippleEffect('.ripple')
})

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId)
})
</script>

<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
#app {
	min-height: 100vh;
	background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Глобальные стили для анимаций */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
	transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
	transform: translateX(-20px);
	opacity: 0;
}

.slide-leave-to {
	transform: translateX(20px);
	opacity: 0;
}
</style>
