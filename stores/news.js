import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
	state: () => ({
		articles: [],
		isLoading: false,
	}),

	actions: {
		async fetchNews() {
			if (this.isLoading) return

			try {
				this.isLoading = true
				const response = await fetch(
					'https://hacker-news.firebaseio.com/v0/newstories.json'
				)
				const ids = await response.json()
				const slicedIds = ids.slice(0, 100)

				const articlePromises = slicedIds.map(async id => {
					const articleResponse = await fetch(
						`https://hacker-news.firebaseio.com/v0/item/${id}.json`
					)
					return await articleResponse.json()
				})

				this.articles = await Promise.all(articlePromises)
			} catch (error) {
				console.error('Ошибка загрузки новостей:', error)
				throw error
			} finally {
				this.isLoading = false
			}
		},
	},
})
