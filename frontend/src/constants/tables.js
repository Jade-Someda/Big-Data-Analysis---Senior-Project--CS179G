export const TABLE_META = {
  hourly_crimes: {
    question: 'How does crime volume change by hour of day?',
    hypothesis: 'Evening and overnight hours see higher crime than daytime.',
    description: 'Each bar represents the number of reported incidents for a particular hour across the city.',
    category: 'Time of day',
  },
  time_period_crimes: {
    question: 'Which time of day is riskiest overall?',
    hypothesis: 'Crimes cluster in evening and overnight periods.',
    description: 'Daytime, evening, and overnight windows aggregated across all years in the dataset.',
    category: 'Time of day',
  },
  monthly_crimes: {
    question: 'How does crime vary across the calendar year?',
    hypothesis: 'Summer months experience a noticeable increase in crime volume.',
    description: 'Total crimes per month across years, useful for seasonal patterns.',
    category: 'Seasonality',
  },
  yearly_crimes: {
    question: 'How have crime levels changed over the years?',
    hypothesis: 'Crime rates exhibit clear long-term trends between 2001 and 2025.',
    description: 'Annual totals across all crime types, useful for spotting long-term shifts.',
    category: 'Long-term trends',
  },
  community_area_crimes: {
    question: 'Which community areas see the most reported crime?',
    hypothesis: 'Downtown and dense neighborhoods appear as persistent hotspots.',
    description: 'Crimes aggregated by community area; pairs well with map visualizations.',
    category: 'Location & spatial patterns',
  },
}

export const COMMUNITY_AREA_COORDS = {
  '8': [41.9009, -87.6265],
  '24': [41.8736, -87.6477],
  '25': [41.8607, -87.6252],
  '28': [41.8811, -87.7642],
  '29': [41.8555, -87.7152],
  '31': [41.7908, -87.7294],
  '32': [41.8781, -87.6298],
  '33': [41.8696, -87.6872],
  '35': [41.8309, -87.6847],
  '38': [41.778, -87.7677],
  '43': [41.8089, -87.7246],
  '44': [41.7474, -87.6638],
  '67': [41.7748, -87.6801],
  '68': [41.7757, -87.6045],
  '71': [41.7441, -87.6476],
  '76': [41.9437, -87.6553],
}

export const INSIGHT_STATUS_META = {
  supported: {
    label: 'Hypothesis supported',
    className: 'insight-badge insight-badge--supported',
  },
  mixed: {
    label: 'Hypothesis partially supported',
    className: 'insight-badge insight-badge--mixed',
  },
  not_supported: {
    label: 'Hypothesis not supported',
    className: 'insight-badge insight-badge--not-supported',
  },
}
