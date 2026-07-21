/**
 * Converts array of log objects into downloadable CSV spreadsheet file
 */
export function exportToCSV(filename, data, headers) {
  if (!data || !data.length) {
    alert('No data available to export.')
    return
  }

  const csvRows = []

  // Add Headers row
  if (headers && headers.length) {
    csvRows.push(headers.join(','))
  } else {
    csvRows.push(Object.keys(data[0]).join(','))
  }

  // Add Data rows
  for (const row of data) {
    const values = Object.values(row).map((val) => {
      const escaped = ('' + (val ?? '')).replace(/"/g, '""')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'))
  const link = document.createElement('a')
  link.setAttribute('href', csvContent)
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
