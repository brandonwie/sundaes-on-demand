# Sundaes-On-Demand

> this app is part of [Testing React with Jest and Testing Library](https://www.udemy.com/course/react-testing-library/) on Udemy

## App Summary

- Choose ice cream flavors and toppings and submit order
- Flavors and toppings come from server
- order is sent to server

<img src="./img/appDesign.jpg" alt="app design" width="500px">

## Backdrop to Test...

- more complex user interactions
  - multiple form entry, moving through order phases
- mouseover popup
  - test that element disappears from DOM
- simulating server response
  - mock service worker
- async app updates
  - awaiting DOM changes
- global state via context

## Spoiler Alert!

- We will not be testing context implementation
  - only interested in testing behavior as seen by user
- Tests no different if we used Redux, Mobx, etc
- Only difference is the test setup
  - make sure component is wrapped in context
  - ensure functionality
  - avoid errors

<img src="./img/entryMockup.jpg" alt="entry mockup" width="250px"><img src="./img/orderSummary.jpg" alt="order summary" width="250px"><img src="./img/thankYou.jpg" alt="thank you page" width="250px">

<br>

## Order Phase State (App-level)

<img src="./img/overview.jpg" alt="order phase state" width="500px">

## Server

- Download from course repo
  - [link](https://github.com/bonnie/udemy-TESTING-LIBRARY/tree/master/sundae-server)
  - Follow instructions in `README.md` to install
- RESTful API, runs on port 3030
- For flavors / toppings, just sends static info
  - In a real app, would come from db
- For order, simply generates random order number 😁
- Server not needed for functional react app testing!
  - use mock-service-worker to mock responses from server

## Set up ESLint and Prettier

- `npm install eslint-plugin-testing-library eslint-plugin-jest-dom`
- remove `eslintConfig` from `package.json`
- Create `.eslintrc.json` and add standard config

## Client

- Organize components by pages

  - `test` directory for each page
  - Jest will find and run any files that ends in `.test.js`

- `src/pages/summary`

  - `OrderSummary.jsx`
  - `SummaryForm.jsx`

- `src/pages/summary/test`
  - `SummaryForm.test.jsx`
