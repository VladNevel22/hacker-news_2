<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useNewsStore } from '/stores/news'

const newsStore = useNewsStore()
let intervalId = null

onMounted(() => {
	newsStore.fetchNews()
	intervalId = setInterval(() => {
		newsStore.fetchNews()
	}, 60000)
})

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId)
})
</script>

<template>
	<router-view />
</template>
<style>
button {
	border-radius: 10px;
	padding: 10px 15px;
	cursor: pointer;
}
button:hover {
	background-color: grey;
	color: white;
}
a {
	color: black;
	text-decoration: none;
}

li {
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	padding: 15px;
	margin: 10px 0;
	transition: transform 0.2s;
	width: 50%;
	list-style-type: none;
}
li:hover {
	transform: scale(1.01);
	box-shadow: 0 5px 10px rgba(1, 0, 0, 0.1);
	background: rgb(218, 217, 217);
}
</style>
