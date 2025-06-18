import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
	state: () => ({
		articles: [],
	}),

	actions: {
		async fetchNews() {
			try {
				// 1. Получаем список ID новостей
				const response = await fetch(
					'https://hacker-news.firebaseio.com/v0/newstories.json'
				)
				const ids = await response.json()

				// 2. Берём только первые 100 ID
				const slicedIds = ids.slice(0, 100)

				// 3. Загружаем каждую новость по ID
				const articlePromises = slicedIds.map(async id => {
					const articleResponse = await fetch(
						`https://hacker-news.firebaseio.com/v0/item/${id}.json`
					)
					const articleData = await articleResponse.json()
					return articleData
				})

				// 4. Ждём завершения всех загрузок
				const articles = await Promise.all(articlePromises)

				// 5. Сохраняем в хранилище
				this.articles = articles
			} catch (error) {
				console.error('Ошибка загрузки новостей:', error)
			}
			setTimeout(function () {
				this.fetchHole()
			}, 2000)
		},
	},
})
