           Docunetation of This Project

yet finilaze Database, Data-Modeling, requare Software.
Develop Step Day wise

-----------Day:- 01 -------------------------

# Day-01

1)create main forder : Youtube_like_clone_Project
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

     --------------------- -------------------------------------

# Day-2

    9) Set Folder in SRC Folder :
                                1) create folder Controller
                                2) create folder db
                                3) create folder middlewares
                                4) create folder models
                                5) create folder routes
                                6) create folder utils (file upload , mail statics process code likhe)

    10) now instail Prittier -> for code -> clean and design ->  npm i -D prettier

       10.1) create .Prettierrc filr in main folder :
                                                      {
                                                        "singleQuote": false,
                                                        ..
                                                        ..
                                                        so on
                                                      }
       10.2) create .prettierignore : in which write file name where prittier not work
            likr:   - .env
            node_modules

    11) now Connect with Database
         11.1) MongoDB Atlas  i have account then -> go in db -> connect -> mongoDB Compass then copy url
               and pest in .env : MONGODB_URL : pest here

               before it instail .env: npm i dotenv

         11.2) in src-> constants.js me set DB name
                                            like DB_Name="Youtube"

    12) install express & mogoose
         npm i express, mongoose
    13) congiggure dotenv in index.js

    14) now Write logics for Db connection in Src-> dbConnection-> dbConnection.js
        and export
    15) import db in configgure or call in index.js

    16) in Package.json : in script: dev change to run so .env, and all extension load
         check work or not : npm run dev

    17) db successfull conecot ho gya hai but usse kisi port pe listion nhi kiye hai
      to ab:
            index.js me kre : connectionDB() prommise return krta hai: app.js use kr rhe to import kre index.js

---

# Day-3

### Today Agenda

write middleware start in app.js cors, use
Write the class sentex of Responce send Error send

    18 ) in app.js ---> npm i cookie-parser, cors
              18.1) install cors -> for kaha kaha se es backend pe request aa skta hai
              18.2) .use(express.json())-> json , json form se data aa skta hai backed me
              18.3) .use(express.urlencoded())--> url se data aa skta hai
              18.4) .use(express.static("folder name))->>> koe static folder ko kahai hai
              18.5) .use(cookieParser())-> cookie send krne ke liye

     19) in src-> utils-> asyncHandler.js
         for formet to resulbe function -> baar baar DB connection ke liye

     20) write class for error return syntex
        in src-> utils-> ApiError.js
          write class and constecter
