import { Promise } from 'q'

/*
 * @date: 2019/11/08 12:54:32
 * @author: Xukuan <kuan.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */

export function createObjectStore (app, objectStoreName, options, indexs) {
  const currentDbVersion = app.$db.version
  app.$db.close()
  const promise = new Promise((resolve, reject) => {
    const request = window.indexedDB.open('db', currentDbVersion + 1)
    request.onerror = function (e) {
      console.log(e)
      reject(e.target.error)
    }
    request.onupgradeneeded = function (e) {
      app.$db = e.target.result
      const objectStoreNames = app.$db.objectStoreNames
      console.log(objectStoreNames, objectStoreName)
      if (!objectStoreNames.contains(objectStoreName)) {
        const objectStore = app.$db.createObjectStore(objectStoreName, options)
        objectStore.transaction.oncomplete = function (e) {
          resolve(objectStore)
        }
        objectStore.transaction.onerror = function (e) {
          reject(e)
        }
        indexs.forEach(item => {
          objectStore.createIndex(item.name, item.keyPath, item.options)
        })
        objectStore.transaction.commit()
      }
    }
  })
  return promise
}

export function getObjectStores (app) {
  const result = Array.from(app.$db.objectStoreNames)
  return result
}

export function addObject (app, objectStoreName, obj) {
  return new Promise((resolve, reject) => {
    const transaction = app.$db.transaction(objectStoreName, 'readwrite')
    transaction.onerror = function (e) {
      reject(e)
    }
    transaction.oncomplete = function (e) {
      console.log(e)
      resolve(obj)
    }
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.add(obj)
    request.onerror = function (e) {
      reject(e)
    }
    request.onsuccess = function (e) {
      transaction.commit()
    }
  })
}

export function updateObject (app, objectStoreName, data, key) {
  return new Promise((resolve, reject) => {
    const transaction = app.$db.transaction(objectStoreName, 'readwrite')
    transaction.oncomplete = function (e) {
      resolve(data)
    }
    transaction.onerror = function (e) {
      reject(e.target.error)
    }
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.put(data, key)
    request.onsuccess = function (e) {
      transaction.commit()
    }
    request.onerror = function (e) {
      reject(e.target.error)
    }
  })
}

export function deleteObject (app, objectStoreName, key) {
  return new Promise((resolve, reject) => {
    const transaction = app.$db.transaction(objectStoreName, 'readwrite')
    transaction.oncomplete = function (e) {
      resolve(key)
    }
    transaction.onerror = function (e) {
      reject(e.target.error)
    }
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.delete(key)
    request.onsuccess = function (e) {
      transaction.commit()
    }
    request.onerror = function (e) {
      reject(e)
    }
  })
}

export function getObjectByKey (app, objectStoreName, key) {
  return new Promise((resolve, reject) => {
    const transaction = app.$db.transaction(objectStoreName)
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.get(key)
    request.onerror = function (e) {
      reject(e.target.error)
    }
    request.onsuccess = function (e) {
      resolve(e.target.result)
    }
  })
}

export function getAllObjects (app, objectStoreName) {
  return new Promise((resolve, reject) => {
    const transaction = app.$db.transaction(objectStoreName)
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.getAll()
    request.onerror = function (e) {
      reject(e.target.error)
    }
    request.onsuccess = function (e) {
      resolve(e.target.result)
    }
  })
}

export function getAllObjectsWithKey (app, objectStoreName) {
  return new Promise((resolve, reject) => {
    const res = []
    const transaction = app.$db.transaction(objectStoreName)
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.openCursor()
    request.onerror = function (e) {
      reject(e.target.error)
    }
    request.onsuccess = function (e) {
      console.log(e)
      const cursor = e.target.result
      if (cursor) {
        console.log(cursor)
        res.push({ value: cursor.value, primaryKey: cursor.primaryKey })
        cursor.continue()
      } else {
        resolve(res)
      }
    }
  })
}

// export default { createObjectStore, getObjectStores }
