# NorthCoders' News API by Mohsin Kaduji

WELCOME

This is an API

WHAT IS THIS API ABOUT?
    -   This api is built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

TRY IT YOURSELF !
    -   Here's a link to the hosted version:
        https://articles-6py6.onrender.com/api
    
    -   Note: If your data is appearing on one line, it can be hard to read. You may find it easier to read by installing a JSON Formatter extension to your browser. We recommend below one for Chrome.
    https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en

HOW TO DOWNLOAD THE SOFTWARE:

    -   Your database will be POSTGRESQL (more info: https://www.postgresql.org/download/), and you will interact with it using node-postgres (more info on node-postgress can be found on https://node-postgres.com/).

    -   In order to get this API, you need to have GIT installed in your local machine, follow the instructions in the link below if you need to set up git in your local machine.
        -How to install git:
            https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

    -   Once you've installed git successfully, clone the git hub repository onto local machine using the following http link to the repository.
        -how to clone using terminal:
            -get into the folder you want to download the API to and run the following command.
                git clone https://github.com/moskgit/News-API.git

    -   Now, when you've got the API on your local machine. follow the following initial set-up instructions.        

INITIAL SET UP:

    Note: In addition to the instructions provided in this software package, follow the following instructions.

    1-  create two more files in the root folder (NEWS-API) as instructed below.

        Please follow the instructions below in order...
        - Please create two files named exactly as below in the root folder (called NEWS-API)

        .env.development
        .env.test

        - add the following line into the development file
            PGDATABASE=nc_news
        - add the following line into the test file
            PGDATABASE=nc_news_test

    2-  run the following command to create and seed a database in order to maintain a local copy of the data.

        -   npm install
        -   npm run setup-dbs
        -   npm run seed

    3-  test the set up by runnig the following command.

        -npm run test
            (Note: the result of the above test run should look something like this...

                > be-nc-news@1.0.0 test
                > jest

                PASS  __tests__/utils.test.js
                PASS  __tests__/app.test.js

                Test Suites: 2 passed, 2 total
                Tests:       2 skipped, 50 passed, 52 total
                Snapshots:   0 total
                Time:        3.185 s, estimated 4 s

            )

You're all set if you've successfully completed the above steps.