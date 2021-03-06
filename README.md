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

---

## Notes

### Sat, Jan 22, 2022

#### passing mock function as a parameter

- jest.fn()

#### Questions to ask

- What to render?
  - what's the smallest component that encompasses tests?
- Do we need to pass any props?
- Do we need to wrap in, say, `OrderDetailsProvider`?
  - Does the provider get used? Is it already wrapped within the component?
- Where should the tests go?
  - which file? New file needed?
- What to test?
  - What's the behavior that needs testing?
- How to test?
  - What queries and events?
- Do wee need to `await`?
  - Is there anything async going on?

### Mon, Jan 17, 2022

#### Order Confirmation Component

- `orderPhase` is in App-level state => in context
- `orderPhase` value determines which page component ot display
- for simplicity, wrap everything in context provider
  - even though the confirmation page doesn't need it
- buttons that update `orderPhase` state in pages
  - button calls setter from props
- reset context `Map`s after clicking `New Order` button
  - context needs additional array item `resetOrder`
- State with `orderNumber`, initial value to `null`

  ```javascript
  if (orderNumber === null) setLoading(true);
  ```

- leave error part as TODO

#### Debugging Tips

- `screen.debug()`
- Does `getBy*` fail when there a server call or other async action?
  - need to use `await findBy*`
- Read test error output carefully
  - exactly which assertion is failing?

#### POSt order to server

- send API call inside useEffect in OrderConfirmation.js
- sever sends random order number: mimic POST with Mock Service Worker

### Sun, Jan 16, 2022

- App `orderPhase` State

  - App passes state setter (`setOrderPhase`) to components as prop
  - Components call `setOrderPhase` to move to next phase

- again... dealing with `Warning: Can't perform a React state update on an unmounted component. This is a no-op ...` error || `Warning: An update to Options inside a test was not wrapped in act(...) ...`
  - basically it happens if there's an API call occurs(update happens) on mount(in useEffect) of a component
  - how to resolve it?
    1. [Skip auto cleanup](https://testing-library.com/docs/react-testing-library/setup/#skipping-auto-cleanup): not possible on a test-by-test basis
    2. Mock useEffect to bypass server call: Not recommended, farther from production code path
    3. Include in the beginning of a test that asserts on state changes
    - One that awaits state changes
      - happen on axios promise promise resolution
    - Don't need to include in all tests b/c it only needs to be tested once

#### some questions to consider

- Should we do a 'black box' test (not consider implementation)?: the answer is 'yes' because we might change implementation later on.
- Do test functions need to be `async`?: yes, options still need to load from server / mock service worker

  - await both the scoop element and another await on the topping element (separate elements)

- grand total should be the same size as titles (\<h2\>)
- search with `heading` role, include the text in the `name` option

  - `{ exact: false}` is not an option for `*byRole`
  - either use `*byRole` and regex for `name` option, or `*byText` and `{ exact: false}`

    ```javascript
    screen.getByRole('heading', { name: /grand total: \$/i }); // a
    screen.getByText('Grand total: $', { exact: false }); // b
    ```

### Sat, Jan 15, 2022

- takeaway

  - when `getByText()` set `exact` option to `false` so that we can find partial matches
  - `await` goes with `findBy`
  - `input` with `number` requires `spinbutton` role to detect when testing
  - `userEvent.clear` to clear existing text, `userEvent.type` to enter number
  - `wrapper` option to `render()` to apply context provider
    - Better redefine testing library render to access easier

- an error happened while testing using Context because of type error (not using parseInt)
- Custom Render

  ```javascript
  // testing-library-utils.jsx
  import { render } from '@testing-library/react';
  import { OrderDetailsProvider } from '../contexts/OrderDetails';

  const renderWithContext = (ui, options) =>
    render(ui, { wrapper: OrderDetailsProvider, ...options });

  // re-export everything
  export * from '@testing-library/react';

  // override render method
  export { renderWithContext as render };
  ```

### Mon, Dec 27, 2021

- behavior driven testing
- use Context
  - [Kent C. Dodds pattern](https://kentcdodds.com/blog/application-state-management-with-react)

#### Server Error

- use simple react-bootstrap alert
  - [Docs](https://react-bootstrap.netlify.app/components/alerts/)
- Jest Debugging Tools
  - running only one test file, one test within a file
- need to import `rest` from msw and `server` from mock server

  ```javascript
      server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get('http://localhost:3030/toppings', (req, res, ctx) =>
      res(ctx.status(500))
    )
  ```

- `waitFor`
  - similar to `waitForElementToBeRemoved`, uses when you see `not wrapped in act(...)` warning

#### Review

- override Mock Service Worker response for individual tests
- unable to find `role="alert"` error => `waitFor`
- isolate file by typing `p`
- `test.only` and `test.skip` to run particular tests
- `waitFor` for tests where `await findBy*` isn't enough

### Sun, Dec 26, 2021

#### Using `userEvent` instead of `fireEvent`

#### Screen Query Methods

  <img src="./img/queryMethods.jpg" alt="query methods" width="500px">

- [API Queries](https://testing-library.com/docs/dom-testing-library/api-queries/)
- [React Testing Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [Query Guide](https://testing-library.com/docs/guide-which-query/)

  - Priority: Queries Accessible to Everyone => Semantic Queries => Test IDs(last resort)

#### `not wrapped in act (...)` warning

- [article to check](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning)
- `waitForElementToBeRemoved`: async function to check if element is removed

#### Simulating Server Response w/ Mock Service worker

- intercept network calls, return specified responses
- `yarn add --dev msw`
- Create handlers => test server => check if server listens => reset after each test

#### asynchronous tests must use `await`, `findBy`

### Wed, Dec 22, 2021

- Copy base codes for testing (pages/summary/\*)
- Write test scripts for `SummaryForm.jsx`
