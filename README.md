# Daily Food Delivery — Location-Based Menu Flow

This project now uses a location-first ordering flow from the home page.

How to use
1. Open `index.html` in a browser.
2. Select a delivery area: Thane, BKC, Churchgate, Andheri, or Borivali.
3. The menu for that location appears with up to 5 dishes total.
4. Filter by `All`, `Veg`, `Non-Veg`, or `Jain` and choose items for the day.
5. Complete the order form to save it in localStorage under `mfd_orders`.

Notes
- Frontend-only prototype. For multi-user support and secure auth, add a backend service and real persistence.
- To reset selections for testing, open DevTools > Application > Local Storage and remove keys starting with `mfd_selection_`.
- The site now keeps menu options location-specific and removes the old standalone menu page.

Categories
- The menu supports `veg`, `non-veg`, and `jain` categories.
- Each location has at most 5 meal options, with a mix of vegetarian, non-vegetarian, and Jain dishes.

Placing orders
- After selecting meals, click the relevant order button and finish the checkout modal.
- View placed orders on `orders.html`.
