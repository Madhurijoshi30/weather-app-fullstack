export default function ForecastCard({ days }) {
  return (
    <div className="forecast-strip">
      {days.map((day, i) => (
        <div className="forecast-day" key={i}>
          <p className="forecast-date">{day.date}</p>
          <img src={day.icon} alt={day.desc} />
          <p className="forecast-temp">{day.temp}°C</p>
          <p className="forecast-desc">{day.desc}</p>
        </div>
      ))}
    </div>
  );
}