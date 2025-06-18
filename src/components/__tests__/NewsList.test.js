import { describe, it, expect } from 'vitest'

describe('Массив из 100 новостей', () => {
	it('содержит 100 элементов и корректные заголовки', () => {
		const articles = Array.from({ length: 100 }, (_, i) => ({
			id: i,
			title: `Новость #${i + 1}`,
		}))

		expect(articles.length).toBe(100)
		expect(articles[0].title).toBe('Новость #1')
		expect(articles[99].title).toBe('Новость #100')
	})
})
