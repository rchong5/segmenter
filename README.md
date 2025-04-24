## segmenter setup

1. Ensure that your environment has a compatible version of node installed and activated

    - segmenter was developed on node v20.19.0

2. Clone the repository

3. Install segmenter's dependencies by running "npm install" from the root of your local repository's directory: [*path_to*/segmenter/]

4. Obtain the "environment.txt" file from Katie

5. Create a ".env" file in the root of your local repository's directory containing the values from the "environment.txt" file

    - environment variables
        - DB_USER
        - DB_PASS
        - DB_HOST
        - DB_APP_NAME

6. Run segmenter by running "npm run build"

7. Reference "bootstrap.mongodb.js" for the initial state of the database

8. Use the Postman export to craft your API requests

9. Submit requests to "localhost:25000"

    - example: localhost:25000/staff/UUID/d46bf151-7d4d-4d75-b9ff-d8223acbf2a0

---

If you have any questions, Katie can provide you with my e-mail address to contact me.