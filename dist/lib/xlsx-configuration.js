"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOrderXLS = parseOrderXLS;
const xlsx_1 = __importDefault(require("xlsx"));
// Helper: convert Excel date or string to JS Date
function parseExcelDate(value) {
    if (typeof value === 'number') {
        // Excel stores dates as days since 1899-12-30 (or 1900-01-00 depending on version)
        return xlsx_1.default.SSF.parse_date_code(value)
            ? new Date(Date.UTC(xlsx_1.default.SSF.parse_date_code(value).y, xlsx_1.default.SSF.parse_date_code(value).m - 1, xlsx_1.default.SSF.parse_date_code(value).d))
            : new Date();
    }
    if (typeof value === 'string' || value instanceof Date) {
        return new Date(value);
    }
    return new Date();
}
// Helper: convert Excel fractional time (0.0 to 1.0) to "HH:mm" string
function excelTimeFractionToHHMM(fraction) {
    const totalSeconds = Math.round(fraction * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
function parseOrderXLS(fileBuffer) {
    const workbook = xlsx_1.default.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx_1.default.utils.sheet_to_json(sheet, { defval: '' });
    if (rows.length === 0)
        throw new Error('Excel sheet is empty');
    const firstRow = rows[0];
    // Parse customer
    const customer = {
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
    const event = {
        event_name: String(firstRow.event_name || ''),
        event_date: eventDate,
        event_time: eventTime,
        event_building: String(firstRow.event_building || ''),
        event_location: String(firstRow.event_location || ''),
        event_category: String(firstRow.event_category || ''),
    };
    // Group portions by section_name
    const groupedSections = {};
    rows.forEach(row => {
        const portion_count = Number(row.portion_count) || 0;
        const portion_price = Number(row.portion_price) || 0;
        const portion_total_price = portion_count * portion_price;
        const portion = {
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
    const sections = Object.entries(groupedSections).map(([section_name, portions], index) => {
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
