           Docunetation of This Project

yet finilaze Database, Data-Modeling, requare Software.
Develop Step Day wise

-----------Day:- 01 -------------------------
1)create mail forder : Youtube_like_clone_Project
2)under above folder, create folder: Backebd
3)backend folder open in VS Code
in vs Code terminal : 1) check Node -v 2) instal NPM init -y 3) create Readme.me File

    4) Set Up gitHup repo with is project :
            in vs Termial :1) git init
                           2) git add .
                           3) git commit -m"add initial file foldet"
                           4)create repo in github
                           5)branch change: git branch -M main
                           6)in terminal: set remote:---> Copy from github repo
                           7)Push > git push -u origin main  --> copy from githyb repo

    5) Make Folder in Backend: Public
         1> under Public folder: create folder: temp
         2> under temp folder: create file : .gitkeep -> for git track this public and temp folder

    6) create .gitignore file in Backend folder
    7) Create SRC folder in Backend Folder
          under SERC Folder create file : 1) app.js
                                          2) constants.js
                                          3) index.js
                                           create thia using -> touch app.js like this

    8) Now work on Package.json file
          1) for Import syntex : chanke in package.josn: -->  (in description) Type: "module'
          2) for run server install nodemon (npm i -D nodemon)
              in script --> "dev": "nodemon src/index.js"
               so run server using : npm run dev

