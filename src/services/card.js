/**
 * 卡片管理
 * @date: 2019/11/11 16:35:16
 * @author: Xukuan <kuan.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import { addObject, createObjectStore, getObjectStores, getAllObjectsWithKey, getObjectByKey, updateObject, deleteObject } from '../db/dbOperations'
export async function createCard (app, card) {
  const objectStores = getObjectStores(app)
  if (!objectStores.includes('cards')) {
    const objectStore = await createObjectStore(app, 'cards', { autoIncrement: true },
      [
        {
          name: 'title',
          keyPath: 'title',
          options: { unique: false }
        }
      ]).then(res => res).catch(err => {
      console.log(err)
    })
    if (objectStore) {
      const res = await addObject(app, 'cards', card)
      return res
    }
  } else {
    const res = await addObject(app, 'cards', card)
    return res
  }
}

export async function getAllCards (app) {
  const cards = await getAllObjectsWithKey(app, 'cards').then(res => res).catch(err => { console.log(err) })
  const groups = await getAllObjectsWithKey(app, 'groups').then(res => res).catch(err => { console.log(err) })
  const m = new Map()
  groups.forEach(item => {
    m.set(item.primaryKey, item.value.groupName)
  })
  const res = cards.map(item => {
    return { ...item, value: { ...item.value, groupName: m.get(item.value.groupId) } }
  })
  return res
}

export async function getCardById (app, key) {
  const res = getObjectByKey(app, 'cards', key).then(res => res).catch(err => { console.log(err) })
  return res
}

export async function updateCard (app, data, key) {
  const res = await updateObject(app, 'cards', data, key).then(res => res).catch(err => { console.log(err) })
  return res
}
export async function deleteCard (app, key) {
  const res = await deleteObject(app, 'cards', key).then(res => res).catch(err => { console.log(err) })
  return res
}
