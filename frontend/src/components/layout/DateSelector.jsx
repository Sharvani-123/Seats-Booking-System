import { dateStr, formatDate } from "../../utils";

const DateSelector = ({ dateOptions, selectedDate, onSelect, today }) => (
  <div style={{
    padding: "14px 28px",
    display: "flex", gap: 8, overflowX: "auto",
    borderBottom: "1px solid #0f172a",
  }}>
    {dateOptions.map((d) => {
      const ds    = dateStr(d);
      const isToday = ds === dateStr(today);
      return (
        <button
          key={ds}
          className={`date-chip ${ds === dateStr(selectedDate) ? "active" : ""}`}
          onClick={() => onSelect(d)}
        >
          {isToday ? "Today" : formatDate(d)}
        </button>
      );
    })}
  </div>
);

export default DateSelector;
