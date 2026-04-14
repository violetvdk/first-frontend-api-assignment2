function Fields ({requiredFields = [], optionalFields = [], values = {}, onFieldChange}) {
  const rows = [
    ...requiredFields.map((field) => ({ name: String(field), required: true })),
    ...optionalFields.map((field) => ({ name: String(field), required: false }))
  ];

  if (rows.length === 0) {
    return <p>No fields found for this category.</p>;
  }

  return (
    <div className="post-fields-wrapper">
      <table className="post-fields-table">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = `field-${row.name.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <tr key={`${row.required ? "req" : "opt"}-${row.name}`}>
                <td>
                  {row.name}
                  {row.required && <span className="required-star"> *</span>}
                </td>
                <td>
                  <label htmlFor={id} className="sr-only">{row.name}</label>
                  <input
                    id={id}
                    name={row.name}
                    type="text"
                    required={row.required}
                    value={values[row.name] || ""}
                    onChange={(event) => onFieldChange(row.name, event.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Fields;