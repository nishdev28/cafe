import "./StatsCircles.css"; // Import the CSS below

const stats = [
	{ value: "87%", label: <>Satisfied<br />Customers</> },
	{ value: "93%", label: <>Organic<br />Customers</> },
	{ value: "83%", label: <>Skilled Staff</> },
];

const StatsCircles = () => (
	<div className="stats-circles-bg">
		{stats.map((stat, idx) => (
			<div
				key={idx}
				className="circle animate-pop"
				style={{ animationDelay: `${idx * 0.3}s` }}
			>
				<div
					className="circle-value animate-fade"
					style={{ animationDelay: `${0.4 + idx * 0.3}s` }}
				>
					{stat.value}
				</div>
				<div
					className="circle-label animate-fade"
					style={{ animationDelay: `${0.7 + idx * 0.3}s` }}
				>
					{stat.label}
				</div>
			</div>
		))}
	</div>
);

export default StatsCircles;
