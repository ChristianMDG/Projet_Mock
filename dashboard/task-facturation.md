- Create a new menu item called Facturation.
- Facturation page content: \* At the top of the page, add filters for: - Travel date range - Koperative (dropdown select list) - Use the existing API endpoint - Layout: xs: 12, md: 6

      * Display the results as an accordion list:
          - Use the existing front-end component VoyageResults as a reference.
          - In each accordion header, show:
              * Koperative logo
              * Koperative name
              * Station gare
              * Total billing amount
              * Payment status (PAID or UNPAID)

          - In the collapsible content:
              * If status = PAID:
                  -- Use VoyageJourney as a reference for the layout
                  -- Display route: departure → arrival
                  -- Show number of reserved seats

              * If status = UNPAID:
                  -- Replace journey time with total billing amount and status in the header
                  -- Seat viewer should be read-only
                  -- Display Mobile Money payment number (cooperative manager’s phone number)
                  -- Show remaining amount to be paid
                  -- Include payment method UI similar to the existing front-end implementation

- Reuse the existing API endpoint throughout.
