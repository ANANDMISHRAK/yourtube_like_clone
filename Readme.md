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

     21) write the syntex for Api Response
         in srx-> utils-> ApiResponse.js

# Day-04

### Today Agenda : now Start real Development of this Project

     Create Model Its logic

     22) Create User Model ---> in Src->Model--> user.model.js
         in user model :-> (userName, email, fullName, password, avatar, coverImage, refreshToken, accessTocken, UpdateTimes, WatchHistory)
         in which---> watchHistory count from Video Scheema model

         coverImage and avatar not sore in Backend -> sore in other storage like Cloudnary or Amozone
         in Backend Database-> store address of image or video

          for create model need mongoose and Schema.

     23) create Video model Scheema under Src-> models-> video.models.js
         (videofile, thumbnail, title, description, duration, view, isPublished, owner--> from user)

     24) for DB query -> write mongoDB  aggregate pipline
         for this ---> npm i mongoose-aggregate-paginate-v2

         for password security ----> use bcrypt
            this ----> npm i bcrypt

          for token jwt---> npm i jsonwebtoken
           token use tile key---> jo token dega usse information deunga
            token have 3 part:
                 1) header ::-> algoritm type
                 2) payload data :::-> information what you want share
                 3) verify signature and secret base encode ----> for verification of user.

    25) befor save user iformation bcrypt the password
       for this in user.model.js -> use pre middleware
        thus middleware take 2 paramere 1)Event 2)callback function
        before the Event execute the callback function the event work

    26) at sign in time we need to compair password
        so user put is original password and in DB have bcrupted password
        so compaire with the hepl od bcript model
        in user.model.js ----> write method for it ----->

    27) for Token
        27.1) generate acces Token usint method using JWT
        27.2) generate refresh Token using method using JWT
        in user.model.js

# Day-05

#### Agenda : setup Cloudnamy , multer middleware

28. create account on Cloudnary and configure in project under Utils -> cloudinary.js

    photo or video (local system )---to ----> Backend (temprory server in Public folder using MULTER middleware)

    then using cloudnary -> Backend server ------- to -----> cloudniry

    if successfullay upload or not then delete from Backend this photo or Video using FS module of express
    :-

    28.1) install MULTER : npm i multer
    28.2) signup or login in clounary (sign up ---> free version use ------> set up : node.js)
    28.3) after account creation --> cloudnary install in backend : npm i cloudinary
    28.4) copy cloudName , API secret from cloudnary and pest in .env file

    these 29.2,3,4 is Backend to clounary
    now local system to Backend
    28.5) in SRC->MIDDLEWARE -> multer.middleware.js
    write middleware for local to Backend

###### Routing and Conroller

: 29) wite Rouring and Controller

     29.1)  creATE FILE IN src -> ROUTES-> USER.ROUTE.JS
           CONFIGURE
           EXPORT
           IMPORT IN APP.JS
           SET IN APP.JS THE ROUTE

30. set router for user sig in process:-
    30.1) for sign in time need to upload image avtar & cover image so need multer and cloudminary middleware then gives to controller to sign in
    30.2) and write controller for sigin in in src-> controller-> userController.js

31) testing user sign in controller in POSTMAN in body in form-data
    Error got : throw new ApiError(...) not work due to this is throw error but i did not handle in catch block
    so throw error is successfull work if handle in catch block

# Day-06

##### Agenda :- LOG-IN

31. login controller  
    31.1) take data fron Body {username, email}
    31.2) validate data userName & email
    31.3) find from DB
    31.4) if not find then throw Error
    31.5) now check password
    31.6) access & Refresh Token Generate and send to user
    31.7) send throw cookise
    31.8) send response

32. write router using Post method for login

# Day-07

##### Agenda : - LogOut process

33. Log Out Controller in User.controller.js

    33.1) user is login or not check using middleWare -> auth.middleware.js--> method name verifyJWT
    33.2) if user is log in then find access token via Cookies , colies get from req.cookies or req.header
    33.3) if got access token then decode this token
    33.4) by help of decoded token have user detels , so find user information from DB by help of user.\_id
    33.5) then send this user in res then call next() this (33.1,2.3.4.5) work in middlewate

    33.6) got user then now work in logout controller
    33.7) update refresh token of DB is undefind
    33.8) return response

    now create Route in user.route.js-> using post method call middlewate verifyJWT then controller

##### referesh token

34. in repetated 15min or 30im 0r 1 hours need to login i.e. generate referesh & access token
    but Login by pass all field is not a good practice so only refesh these token in one click and continuew login

    ###### step

    34.1) take Refresh Token : come from cookie -> docode it and find user from DB
    34.2) compair refesh Token from DB
    34.3) if match then generate access token
    34.4) send response

#### Update User

35. change current password

    35.1) take data from req body -> oldPassword, newPassword
    35.2) find user all things from DB using user.\_id
    35.3)check given old password is match with DB password
    35.4) if match then update and save
    35.5) return response

    this is in user controller
