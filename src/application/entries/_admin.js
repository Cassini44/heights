import initTables   from '@admin/admin.load.tables';
import initCourses  from '@admin/admin.courses';
import initPackages from '@admin/admin.packages';
import initZones    from '@admin/admin.zones';
import '@admin/style.css'
/* -------------------------------------------------------------------------- */



window.addEventListener("load", async () => {

   await initTables()
   
   initCourses()
   initPackages()
   initZones()

   


});


