type LocaleLabels = { labelSingular: string; labelPlural: string };

const STANDARD_OBJECT_EN_LABELS: Record<string, LocaleLabels> = {
  // Twenty standard objects
  company:          { labelSingular: 'Company',          labelPlural: 'Companies' },
  person:           { labelSingular: 'Person',           labelPlural: 'People' },
  opportunity:      { labelSingular: 'Opportunity',      labelPlural: 'Opportunities' },
  note:             { labelSingular: 'Note',             labelPlural: 'Notes' },
  task:             { labelSingular: 'Task',             labelPlural: 'Tasks' },
  workflow:         { labelSingular: 'Workflow',         labelPlural: 'Workflows' },
  dashboard:        { labelSingular: 'Dashboard',        labelPlural: 'Dashboards' },
  // Revenue OS custom objects
  order:            { labelSingular: 'Order',            labelPlural: 'Orders' },
  lineItem:         { labelSingular: 'Line Item',        labelPlural: 'Line Items' },
  businessEvent:    { labelSingular: 'Business Event',   labelPlural: 'Business Events' },
  hardwareSku:      { labelSingular: 'Hardware SKU',     labelPlural: 'Hardware SKUs' },
  capability:       { labelSingular: 'Capability',       labelPlural: 'Capabilities' },
  hardwareCapability: { labelSingular: 'SKU Capability', labelPlural: 'SKU Capabilities' },
  hardwareConfig:   { labelSingular: 'Hardware Config',  labelPlural: 'Hardware Configs' },
  accessory:        { labelSingular: 'Accessory',        labelPlural: 'Accessories' },
};

export const getStandardObjectLabel = (
  nameSingular: string,
  fallbackSingular: string,
  fallbackPlural: string,
  locale: string | null | undefined,
  useSingular = false,
): string => {
  if (locale === 'en') {
    const en = STANDARD_OBJECT_EN_LABELS[nameSingular];
    if (en) return useSingular ? en.labelSingular : en.labelPlural;
  }
  return useSingular ? fallbackSingular : fallbackPlural;
};

