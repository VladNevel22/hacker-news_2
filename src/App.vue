<script setup>
import { onMounted } from 'vue'
import { useNewsStore } from '/stores/news'

// создаём подключение к нашему хранилищу
const newsStore = useNewsStore()

onMounted(() => {
	newsStore.fetchNews()

	setInterval(() => {
		newsStore.fetchNews()
	}, 60000)
})
</script>

<template>
	<router-view />
</template>

<style>
button {
	border-radius: 10px;
	padding: 5px 10px;
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
a:hover {
	border: 1px solid black;
	border-radius: 5px;
	padding: 3px;
	background-color: black;
	color: azure;
}
</style>
