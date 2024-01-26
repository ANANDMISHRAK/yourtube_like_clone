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

36. who is current user -> send to frontend

                          36.1) req.user gives who is corrent user all information at time of lofin
                          direct send it in response

    in router check login or not then controller work

37. update Account like fullName, email , both or one

                          37.1) take fullname and password from body
                          37.2) find user and update from DB using req.user.\_id
                          37.3) return response

38. update Avatar Image

                          38.1) take local Avatar image from req.file. path
                          38.2) upload on cloudnariry
                          38.3) find user from data base
                          38.4) deletd old avatar from clodinary using db avatar path
                          38.5) set new path of avatar in DB
                          38.6) return response

39. Update Cover Image

                          39.1) take local Cover Image from req.file.path
                          39.2)find user fron req.user
                          39.3)check , is coverImage url is present in DB (for old COVER Image) then
                          39.3.1) yes -> then remove from clodinary user coverImage Publick id
                          39.4) now present coverimage upload on cloudinary
                          39.5) set and save in Database
                          39.6) return response

    write router in user.router.js

Now in frontend user profile need to show , How many channel , user have subscribe
and how many people is subscribe user channel Like : follower and Following on instaGram or Youtube

so need

###### create Subscription schema

40. subscription schema
    id ---> create my mongoDB
    subscriber ---> user id from user model : -> how many people subscribe you Like Fllower
    chanel ---> user id from user model : -> how many channel you subscribe Like Following
    timestamps

41. how to find subscriber : How many people follow you i.e. : Follower
    let a, b, c,d, e, f, g,h, i, j user on site , in which f, g, h, i, have channel -> ye video upload krta hai
    a user subscribe to g channel
    a- {
    subscriber: a,
    channel: g
    }

    b user subscribe to g channel
    b- {
    subscriber: b,
    channel: g
    }

    c user subscribe to g channel
    c- {
    subscriber: c,
    channel: g
    }

    c user subscribe to h channel
    c- {
    subscriber: c,
    channel: h
    }

    c user subscribe to i channel
    c- {
    subscriber: c,
    channel: i
    }

    ques - > i channel ko kitna subscriber hai :- find follower
    count all document , which channel value is equal to "i" i.e. ---> 1

    ques -> i am user "c" , kitne channel ko subscribe kiya hu -> find following
    count all document , which subscriber value is equal to "C"

    ye user ke profile pe show krwana hai to user controller me hi eska controller likhe

    ##### Step to find subscriber of user

                                     step 1 -> subscription collection ko left join krna hoga user collection ke sath so need
                                     aggregation pipline
                                     step 2 -> find kis user ka subscriper find krna hai so user Name chaliye jo url se milega -> use req.params
                                     step 3 -> write aggrigation pipline

    step to use aggregation
                          step 1 -> find document from User which uaserName match -> using match operation
                          step 2 -> now to look into subscription model from User model , Here localField -> userID fron userModel user document jo step 1 me nikale hai
                          step 3-> forignField - channel from subscriptin model jise look kr rhe hai , channel me user ka id hai
    if local or forign match krega usse count kr lenge

        similler to find How many Followung same lookup

        then Addfield se dono ko add kr lenge

        in last Project kr dunga
        and response send

# Day - 08

###### for whatch Histroy

similler for watch history piple line fron Video model

now user things is compited so move on create comment , like , tweet models

###### create Comment.model.js

    _id:  from mongo Db
    content: string
    video: kis video pe comment huaa due to -> id of video
    owner: kon user comment kiya uska id
    timeStamps

    in this plugin pipeline aggrigration

    simmilar to like, playlist, tweet model created in model folder

###### alll work is done , now only do write controller and is router and use in app.js

write controller fails :
                        1. Video controller -> video.controller.js
                        2. subscription controller ->subscription.controller.js
                        3. playlist controller -> playlist.controller.js 
                        4. comment controller 
                        5. like controller
                        6. tweet controller 
                        7. dashboard controller 
                        8. healthcheck controller

                            respective all write router and aap.use( in app.js

                            )

# Day-09

##### in Video Controller

1.  write video publish controller ->
    in middleware check user login or not

    if log in then start to work in controller :
                                                           step 1) - take title and description fron req. body
                                                           step 2) - take video local path and thumblin local path from req.files.video[0].path simillar to thumblin
                                                           step 3) - now upload both on cloudnary
                                                           step 4) - create user
                                                           step 5) - check created or not
                                                           step 6) - return response

2.  Update Video title , description , and thumbnail :
                                                           step 1)- take videoId from url
                                                           step 2) - take title, description from body
                                                           step 3) - take thumbnail from file
                                                           step 4) - if video all about from collention DB in Video
                                                           step 5) - check video.owner is eualt to user.\_id - user from req.user
                                                           step 6) - now thumbnail upload on cloudinary
                                                           step 7) - delete old thumbnail
                                                           step 8) - now findbyidAndUpdate
                                                           step 9) - return response

3.  delete video operation :
                                                           step 1) - take video id from url
                                                           step 2) - find video from collection
                                                           step 3) - check video owner is equal to user id , user from req. user
                                                           step 4) - now delete video from cloudinary
                                                           step 5) - delete thumbnail from cloudinary
                                                           step 6) - delete document fron video collectiuon
                                                           step 7) - return response

4.  get updio by id :
                                                           step 1) - take id from url
                                                           step 2) - find video using find by id from collection
                                                           step 3) - return response

5.  change the publice status of video :
                                                           step 1) - take video id from url
                                                           step 2) - find video from DB accoding video id
                                                           step 3) - check user id is equal to video owner
                                                           step 4) - now update status
                                                           step 5) - return response

6.  get all video in one take pass 10 video and sorted order :
                                                           step 1) - take query , sortBy , sortType userid , limit=10, page=1 from req.query
                                                           step 2) - create pipline
                                                           step 3) - push query
                                                           step 4) - check user id vaild or not
                                                           step 5) - if valid then push in pipline and match with user id
                                                           step 6) - fetch video which status is true
                                                           step 7) - sort according to sortBy, sortType
                                                           step 8) - now aggregate all video in pipline
                                                           step 9) - create option
                                                           step 10) - paginate according to aggregate video
                                                           step 11) - return response

##### create routr for all video controller and set in video route in app.js

# Day 10

##### Now work in PayList Controller, routing
