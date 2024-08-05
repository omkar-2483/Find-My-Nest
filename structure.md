* MongoDB database- homeheavens
# Models-store All models used in project
   * Model 1- Listing 
   1. title
   2. description
   3. image
   4. price
   5. location
   6. country
   
   * Listing-Review => One to Many Relation
   add one more key in listing for reviews, which store ObjectId of its all reviews.

   * Model 2- Review
   1. comment 
   2. rating
   3. createdAt 

# init - to initialize the database and website
   * init data is stored in data.js
   * run index.js to initialize/re-initialize database

# Views - contain all templates
   * layouts have boilerplate for common includes
   * listing have all pages related to listings

# Public - Static files
   * all static files are stored in public folder 

# utils - extra files
   * extra utility files like error handler ect are stored in util folder 

# Validations
   * for client side validation, we set required in input field and applied bootstrap class 'needs-validatin', the logic of 'needs-validation' is written in "public/js/script.js" 
   * we used "joi" tool for server side schema validation in schema.js

# routes 
 * all routes are moved in respective route files


