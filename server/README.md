# API Documentation
List of Routes:   

Route                      | HTTP | Description                                                       | Input
---------------------------|:----:|-------------------------------------------------------------------|:------:
/                          | GET  | List all starred repositories                                     | -
/filter                    | POST | List starred repositories with filter                             | (one of the list's object keys): (desired value)
/searchByName/:name/:owner | GET  | List all repositories with keyword = :name that's owned by :owner | -
/                          | POST | Create a new repository                                           | name: (repository name), description: (description)
/:username                 | GET  | List all repositories of user with username = :username           | -
/star/:owner/:repo         | GET  | Star a repository of :owner that's named :repo                    | -
/unstar/:owner/:repo       | GET  | Unstar a repository of :owner that's named :repo                  | -

# Usage
With only npm:  
**npm install**  
**npm start (node) / npm run dev (nodemon)**