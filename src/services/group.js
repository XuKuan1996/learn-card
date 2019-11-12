/*
 * @date: 2019/11/11 10:25:52
 * @author: Xukuan <kuan.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: Copyright (c) 2019, Hand
 */
import { getAllObjectsWithKey, getObjectStores, createObjectStore, addObject, updateObject, deleteObject } from '../db/dbOperations'

export async function getGroupList (app) {
  const objects = await getAllObjectsWithKey(app, 'groups').then(res => {
    console.log(res)
    return res
  }).catch(err => {
    console.log(err)
  })
  console.log('re', objects)
  return objects
}

export async function createGroup (app, data) {
  const objectStores = getObjectStores(app)
  if (!objectStores.includes('groups')) {
    const objectStore = await createObjectStore(app, 'groups', { autoIncrement: true },
      [
        {
          name: 'groupName',
          keyPath: 'groupName',
          options: { unique: true }
        }
      ]).then(res => res).catch(err => {
      console.log(err)
    })
    if (objectStore) {
      const res = await addObject(app, 'groups', data).then(res => res).catch(err => { console.log(err) })
      return res
    }
  } else {
    const res = await addObject(app, 'groups', data).then(res => res).catch(err => { console.log(err) })
    return res
  }
}

export async function updateGroup (app, data, key) {
  const res = await updateObject(app, 'groups', data, key).then(res => res).catch(err => { console.log(err) })
  return res
}

/**
 *
 * 删除分组
 * @export
 * @param {*} app
 * @param {*} key
 * @returns
 */
export async function deleteGroup (app, key) {
  const res = await deleteObject(app, 'groups', key).then(res => res).catch(err => { console.log(err) })
  return res
}
