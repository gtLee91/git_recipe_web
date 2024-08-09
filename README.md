# Recipe Web Project

## Description
This project is a recipe web application where users can store, share, and explore cooking recipes while engaging with the community by reading and leaving comments or evaluations on each recipe. Users can upload their own recipes, browse those shared by others, and interact with fellow cooks. The web application aims to foster a vibrant cooking community where users can learn and share their culinary experiences.

This project was developed using React and JavaScript as part of a team effort. The contributions of each team member are detailed in the section below, Description of Web Page Components and Style Files.

## Features

### User Login
- Users can log in using their registered information.
### User Registration
- Users can register their accounts by entering their information.
### Upload Recipes
- Users can write and upload their own cooking recipes.
### Recipe Modification
- Users can edit their own cooking recipes.
### Delete Recipes
- Users can delete recipes they have uploaded.
### Navigating Recipes
- Users can search and explore other people's recipes using various categories or keywords.
### Comment and Evaluate
- Users can leave comments on each recipe and rate them with a rating.

## Web Page UI
For a detailed overview of the web page UI design, please refer to the [UI Design](./docs/web_recipe_UI.pptx).

## Description of Web page components and style files
### 1. Component
#### Add_IngreModal.js
- Description: Create a new ingredient Modal window
- contribution: (Gwantea Lee)
#### Del_RecipeModal.js
- Description: Delete the recipe function. & the modal window that asks again before deleting the recipe.
- contribution: (Gwantea Lee)
#### Dt_Recipe.js
- Description: Recipe details and shows all data such as food photos, ingredients, recipes, and reviews.
- contribution: (Geunmok Song)Food ingredients, recipes, reviews parts (Gwantea Lee) Food photo part
#### Header.js
- Description: The components that make up the header of a webpage.
- contribution: (Gwantea Lee)
#### Login.js
- Description: A component with a login page and functionality.
- contribution: (Geunmok Song)
#### Recipe_Add.js
- Description: This component provides a form for users to register new recipes. Users can select, add, and delete ingredients, enter instructions, and upload photos.
- contribution: (Geunmok Song) Upload photo part / (Gwantea Lee) developed all the features of the recipe registration page except for the image upload functionality.
#### Recipe_List.js
- Description: Displays a list of recipes, provides filtering and searching capabilities, and performs page navigation capabilities
- contribution: (Geunmok Song)
#### Recipe_modify.js
- Description: A component with a recipe modification page and functionality.
- contribution: (Geunmok Song) Upload photo part / (Gwantea Lee) developed all the features of the recipe modification page except for the image upload functionality.
#### Recipe.js
- Description: A component that displays all recipes stored in the database as a list.
- contribution: (Geunmok Song)
#### Review.js
- Description: Displays the review information in a table format, and allows the user who created the review to delete it.
- contribution: (Geunmok Song)
#### User_Register.js
- Description: A component with a user registration page and functionality.
- contribution: (Gwantea Lee)

### 2. Css
#### Dt_Recipe.css
- Description: This CSS file defines the style of the Dt_recipe component.
- contribution: (Geunmok Song)
#### Header.css
- Description: This CSS file defines the style of the Header component.
- contribution: (Gwantea Lee)
#### Login.css
- Description: This CSS file defines the style of the Login component.
- contribution: (Geunmok Song)
#### Recipe_Add.css
- Description: This CSS file defines the style of the Recipe_Add component.
- contribution: (Gwantea Lee)
#### Recipe_List.css
- Description: This CSS file defines the style of the Recipe_List component.
- contribution: (Geunmok Song)
#### Recipe_Modify.css
- Description: This CSS file defines the style of the Recipe_Modify component.
- contribution: (Gwantea Lee)

### 3. hooks
#### useFetch.js
- Description: Defines a custom React hook useFetch, which is responsible for retrieving data from a given URL and managing it as a state.
- contribution: (Gwantea Lee) (Geunmok Song)
