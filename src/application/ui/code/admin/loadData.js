import server from "@shared_js/server.js"




/**
 * @typedef {Object} data
 * @property {any[]} class_locations
 * @property {any[]} courses_all
 * @property {any[]} courses_table
 * @property {any[]} delivery_hours_cost
 * @property {any[]} delivery_methods
 * @property {any[]} locations_table
 * @property {any[]} package_courses
 * @property {any[]} packages_all
 * @property {any[]} users_table
 */

/** @type {data} */
let _loading = null;

/** @type {data} */
let _data = null;


    

export default async function loadData({ refresh = false } = {}) {
  
  if (_data && !refresh) return _data;

  if (_loading && !refresh) return _loading; // 👈 same promise shared

  _loading = server.hdsData('getAdminData')
    .then(res => {
      _data = res.data;
      _loading = null;
      return _data;
    })
    .catch(err => {
      _loading = null; // ⚠️ reset even on failure
      throw err;
    });

  return _loading;
}












