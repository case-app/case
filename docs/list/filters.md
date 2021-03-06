# Filters

- Front-end
- Back-end

On list views, you can chose from a large set of filters to help you filter the lists you are viewing.

Those filters can be set form the `filters` property the the component class of your resource (usually `$Resource$ListComponent`) :

```js
  // Generates a date range filter for "issue date" selection and a checkbox filter for "late invoices only".
  filters: Filter[] = [
    {
      label: 'Late invoices only',
      property; 'lateInvoicesOnly',
      inputType: InputType.Checkbox,
      className: 'is-3 no-label p-x-0-mobile',
    },
    {
      label: `Issue date`,
      properties: {
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
      },
      inputType: InputType.DateRange,
      className: 'is-12',
    },
  ]
```

This will add query parameters to your `GET /$resources$` request. You have then to make sure in the back-end that those query parameters are considered and return a filtered value.

There is a bunch of diferent inputs that you can use as filters like the [multi search](../features/multi-search.md).
