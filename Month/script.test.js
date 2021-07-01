const formatter = Intl.DateTimeFormat('us', {
  dateStyle: 'medium',
  timeStyle: 'long',
  timeZone: 'America/Chicago',
  timeZoneName: 'short'
})

const date = new Date(Date.UTC(2020, 2, 15, 0, 0, 0, 0))

const result = formatter.format(date)

console.log(result)
