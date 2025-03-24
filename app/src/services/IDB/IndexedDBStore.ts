/**
 * Abre ou cria um banco de dados IndexedDB e retorna um objeto de loja de objetos.
 *

 * @param {string} keyPath - A chave primária para a loja de objetos.
 * @param {'readonly' | 'readwrite'} option - A opção de transação ('readonly' para leitura, 'readwrite' para leitura e gravação).
 * @param {number} version - A versão do banco de dados.
 *
 * @returns {Promise<IDBObjectStore>} - Uma Promise que resolve com o objeto de loja de objetos.
 */

export const openIndexedDB = (keyPath: string, option: 'readonly' | 'readwrite', version: number) => {
	return new Promise<IDBObjectStore>((resolve, reject) => {
		const request = window.indexedDB.open("zentaak", version)
		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			db.createObjectStore("user")
		}

		request.onsuccess = (event) => {
			const db = (event.target as IDBOpenDBRequest).result
			const tx = db.transaction(keyPath, option)
			const store = tx.objectStore(keyPath)
			resolve(store)
		}

		request.onerror = (event) => {
			reject((event.target as IDBOpenDBRequest).error)
		}
	})
}