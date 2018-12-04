# FoodTruck-Online-Order with AngularJS (Single Page Application)

Responive(In progress) and Dynamic Web Application enabling FoodTruck online order

Features:

1. AngularJs(Front-End), NodeJS, Express, MongoDB (Back-End), and other packages(passport, csrf, ...) used.

2. Online order enabling with either a guest or signin.

3. FoodTruck location display on the map based on its scheduled address.

4. Weather service based on Food Truck location.

5. Dish availability checkd based on its stock.

6. Owner pages to see today's online orders, check dish inventory status, and manage(modify, delete, add) online order items, modify foodtruck location, and manage DB.

7.Checkout process with Stripe payment (please refer to Stripe payment in https://github.com/tim1017/FoodTruck-Online-Order)

8. Email-based password reset (Emailing disabled due to security - can be activated with your Gmail account)

9. Not much focus to its design, but more to its functions

To run the codes:

1. Install and eanble necessary tools (NodeJS, All Packages thru NPM, MongoDB) in your computer (http://localhost:3000)

2. Go to 'seed' directory and run 'node ftlocationseeder.js' and 'node productseeder.js' to set up foodtruck location addresses and online order items in DB

3. Run 'npm start' and go to 'http://localhost:3000' to see the main page

4.Need your own Google Map API, Google Mail Account, and OpenWeathr API Key to fully activate this FoodTruck Online order.
