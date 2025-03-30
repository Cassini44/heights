import { defineConfig } from 'vite';
import { join } from 'path';



export default defineConfig({
  /* -------------------------------------------------------------------------- */
  
  resolve: {
      alias:  {
          "@admin":       join(process.cwd(), "src", "application", "ui","code","admin"),
          "@student":       join(process.cwd(), "src", "application", "ui","code","student"),
          "@instructor":       join(process.cwd(), "src", "application", "ui","code","instructor"),

          "@shared_js":     join(process.cwd(), "src", "application","shared", "js"),
          "@shared_css":    join(process.cwd(), "src", "application","shared", "css"),

          "@static_js":     join(process.cwd(), "static", "js"),
          "@static_css":    join(process.cwd(), "static", "css")

        },
    },
    
    /* -------------------------------------------------------------------------- */

    root: join(process.cwd(), "src", "application","entries"),

    

    build: {
        outDir: join(process.cwd(), "dist"),
        manifest: true, // 👈 ADD THIS LINE
        emptyOutDir: true,
        rollupOptions: {
            input : {
                main: "/main.js", // ✅ relative to `root`,
                admin: "/_admin.js",
                student: "/_student.js",
                instructor: "/_instructor.js"
            }
        },
  },
});


