# Bob W

### Test assignment for the role of Front-end developer in Bob W company

### Company [LinkedIn](https://www.linkedin.com/company/bobw)

**Line of business:** provider of short-term apartments throughout Europe. An alternative to hotels and AirBnB.

## To run

```
npm i
npm run dev
```

## Tech assignment specifications

Create a SPA that allows a guest to book a room. The application consists of the following booking stages:

* **Booking date and time selection:**
  * Prevent overlapping bookings.
  * Dates are displayed in a property's local timezone.
  * Discounts:
    * For 3 nights booking or longer gets 5% discount on the booking.

* **Room selection step:**
  * Shows rooms list with room names, prices and images.
  * It should be possible to select one of the available rooms.

* **Products step:**
  * Shows products list with names, prices and images.
  * Discounts:
    * For 28 nights or longer booking gets free breakfast offered.

* **Create booking:**
  * Make a POST request to endpoint http://localhost/booking with the booking data and orders.
  * Dates must be converted from the property's local timezone to UTC.

* **Success page with summary:**
  * Booking dates, room and product orders with prices are displayed.
  * The amount that is saved with discounts is shown.

* **Can navigate back and forth between steps except from the success page.**

### *Mock data should be hardcoded (no need to implement backend)*

## Details of implementation

* Addressed all requirements in the assignment specifications. Additionally:
  * Added a limitation in the choice of time user check-in, because of the time zones, at the destination `TZ` may be later than app offer to choose. In other words, user can't check in at 1pm if the time zone of the property is already 3pm.
  * Overall used the design system for better UI/UX
  * Additionally, `404` page, application error page and other visual elements are created for better UI/UX
  * All network requests use `AbortController` to abort the request if the user leaves the page while the request is running
  * Purposefully used `URL` parameters to pass user selection data between pages (dates, rooms, products). Made to simulate the case when a user wants to share a link with another person
  * A basic backend was used. All requests have random delay to simulate close to real working conditions
  * Used `Redux` and `Context` as state manager
  * The architecture of the app is designed to be extensible
  * `database` data, namely booked rooms, edit in the file `src/data/db.json`

## What additionally could have been implemented

* Caching. Both server query results and stored data in state managers. However, the risk of obsolete data must be considered.
* Additional techniques in UI designed to increase the conversion rate of room booking (different UI/UX patterns)
* Preloaders or or progressive image loading for room/product cards