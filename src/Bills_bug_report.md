# BillsUI Component Documentation

## Objective
Ensure that the bills displayed on the Bills Page are ordered from the earliest to the latest date.

## Changes Made

### 1. Sorting Bills by Date in `BillsUI` Component

**File Modified**: `BillsUI.js`

**Modification Details**:
- Updated the `rows` function to sort the bills by date in ascending order before rendering them.

```javascript
const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
  `)
}

const rows = (data) => {
  // Sort the data by date in ascending order before rendering
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
  return (sortedData && sortedData.length) ? sortedData.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills, loading, error }) => {

  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}
```

**Reason**: Sorting the bills ensures that they are displayed from the earliest to the latest date in the UI.

### 2. Test to Verify Ordering

**File Modified**: `Bills.test.js`

**Test Case Details**:
- The test case `Then bills should be ordered from earliest to latest` was updated to verify that the dates are displayed in ascending order.

```javascript
test("Then bills should be ordered from earliest to latest", () => {
  document.body.innerHTML = BillsUI({ data: bills });

  const dates = screen
    .getAllByText(
      /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
    )
    .map((a) => a.innerHTML);

  console.log("Extracted dates:", dates);

  // Define the sorting function for ascending order using Date objects
  const chrono = (a, b) => new Date(a) - new Date(b);

  // Sort dates in ascending order
  const datesSorted = [...dates].sort(chrono);

  console.log("Sorted dates:", datesSorted);

  // Expect the dates array to be equal to the sorted dates array
  expect(dates).toEqual(datesSorted);
});
```

**Reason**: This test ensures that the bills are displayed in the correct order on the Bills Page.

## Steps to Verify

1. **Run the Application**:
   - Ensure that the application displays the bills in the Bills Page from the earliest to the latest date.

2. **Run the Tests**:
   - Execute the test suite to verify that the test case `Then bills should be ordered from earliest to latest` passes.

   ```sh
   npm test
   ```

   - The test should output a success message indicating that the bills are ordered correctly.

## Summary

By updating the `BillsUI` component to sort bills by date before rendering and verifying this with a test, we ensure that the bills are displayed in the correct order. This enhances the user experience by presenting the data in a logical and expected manner.

## Files Modified

- **`BillsUI.js`**: Added sorting logic to the `rows` function.
- **`Bills.test.js`**: Updated the test to check the order of dates.

These changes ensure that the bills are consistently displayed from the earliest to the latest date, both in the application and in the test environment.