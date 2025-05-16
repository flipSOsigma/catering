import xlsx from 'xlsx';

interface Customer {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface Event {
  event_name: string;
  event_date: Date;       // Use Date object here
  event_time: string;     // Keep time as HH:mm string
  event_building: string;
  event_location: string;
  event_category: string;
}

interface Portion {
  section_name: string;
  portion_name: string;
  portion_count: number;
  portion_price: number;
  portion_total_price: number;
  portion_note: string;
}

interface Section {
  id: string;
  section_name: string;
  section_note: string;
  portions: Portion[];
  section_portion: number;
  section_price: number;       // Average portion price maybe?
  section_total_price: number;
}

interface OrderData {
  customer: Customer;
  event: Event;
  sections: Section[];
  price: number;
  portion: number;
  invitation: number;
  visitor: number;
  note: string;
  event_name: string;
  created_at: Date;
}

// Helper: convert Excel date or string to JS Date
function parseExcelDate(value: any): Date {
  if (typeof value === 'number') {
    // Excel stores dates as days since 1899-12-30 (or 1900-01-00 depending on version)
    return xlsx.SSF.parse_date_code(value) 
      ? new Date(Date.UTC(
          xlsx.SSF.parse_date_code(value).y,
          xlsx.SSF.parse_date_code(value).m - 1,
          xlsx.SSF.parse_date_code(value).d
        ))
      : new Date();
  }
  if (typeof value === 'string' || value instanceof Date) {
    return new Date(value);
  }
  return new Date();
}

// Helper: convert Excel fractional time (0.0 to 1.0) to "HH:mm" string
function excelTimeFractionToHHMM(fraction: number): string {
  const totalSeconds = Math.round(fraction * 24 * 60 * 60);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function parseOrderXLS(fileBuffer: Buffer): OrderData {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  if (rows.length === 0) throw new Error('Excel sheet is empty');

  const firstRow = rows[0];

  // Parse customer
  const customer: Customer = {
    customer_name: String(firstRow.customer_name || ''),
    customer_email: String(firstRow.customer_email || ''),
    customer_phone: String(firstRow.customer_phone || ''),
  };

  // Parse event with proper date and time handling
  const rawEventDate = firstRow.event_date;
  const rawEventTime = firstRow.event_time;

  const eventDate = parseExcelDate(rawEventDate);
  const eventTime = typeof rawEventTime === 'number' 
    ? excelTimeFractionToHHMM(rawEventTime) 
    : String(rawEventTime || '');

  const event: Event = {
    event_name: String(firstRow.event_name || ''),
    event_date: eventDate,
    event_time: eventTime,
    event_building: String(firstRow.event_building || ''),
    event_location: String(firstRow.event_location || ''),
    event_category: String(firstRow.event_category || ''),
  };

  // Group portions by section_name
  const groupedSections: { [key: string]: Portion[] } = {};

  rows.forEach(row => {
    const portion_count = Number(row.portion_count) || 0;
    const portion_price = Number(row.portion_price) || 0;
    const portion_total_price = portion_count * portion_price;

    const portion: Portion = {
      section_name: String(row.section_name || ''),
      portion_name: String(row.portion_name || ''),
      portion_note: String(row.portion_note || ''),
      portion_count,
      portion_price,
      portion_total_price,
    };

    if (!groupedSections[portion.section_name]) {
      groupedSections[portion.section_name] = [];
    }
    groupedSections[portion.section_name].push(portion);
  });

  const sections: Section[] = Object.entries(groupedSections).map(([section_name, portions], index) => {
    const section_total_price = portions.reduce((sum, p) => sum + p.portion_total_price, 0);
    const section_portion = portions.reduce((sum, p) => sum + p.portion_count, 0);
    // Average portion price (optional)
    const section_price = section_portion > 0 ? Math.round(section_total_price / section_portion) : 0;

    return {
      id: `section-${index}`,
      section_name,
      section_note: '',
      portions,
      section_portion,
      section_price,
      section_total_price,
    };
  });

  const total_price = sections.reduce((sum, sec) => sum + sec.section_total_price, 0);
  const total_portion = sections.reduce((sum, sec) => sum + sec.section_portion, 0);

  return {
    customer,
    event,
    sections,
    price: total_price,
    portion: total_portion,
    invitation: 1,
    visitor: 1,
    note: '',
    event_name: event.event_name,
    created_at: new Date(),
  };
}
