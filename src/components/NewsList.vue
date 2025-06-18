<script setup>
import { onMounted } from 'vue'
import { useNewsStore } from '/stores/news'

const newsStore = useNewsStore()

onMounted(() => {
	newsStore.fetchNews()

	setInterval(() => {
		newsStore.fetchNews()
	}, 60000)
})
</script>

<template>
	<div>
		<h1>Последние новости Hacker News</h1>
		<p>Количество новостей: {{ newsStore.articles.length }}</p>

		<button @click="newsStore.fetchNews">Обновить</button>

		<ul>
			<li v-for="article in newsStore.articles" :key="article.id">
				<RouterLink :to="`/news/${article.id}`">
					{{ article.title || 'Без заголовка' }}
				</RouterLink>
			</li>
		</ul>
	</div>
</template>
