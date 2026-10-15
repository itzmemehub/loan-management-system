// Adds sample loan applications (with sample document files) so the admin
// dashboard has something to show.
//
//   npm run seed         replace the sample applications
//   npm run seed:clear   remove them
//
// Only records whose email is in the list below are touched; real
// applications are never changed.

require("node:dns").setServers(["8.8.8.8", "8.8.4.4"]);

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const connectDB = require("../config/db");
const LoanApplication = require("../models/LoanApplication");

const uploadDir = path.join(__dirname, "..", "uploads");
const DOCS = ["aadhaar", "pan", "salarySlip", "bankStatement", "photo"];
const DOC_TITLES = { aadhaar: "Aadhaar card", pan: "PAN card", salarySlip: "Salary slip", bankStatement: "Bank statement" };

// daysAgo: when the application was received. missing: documents not uploaded.
const samples = [
  { fullName: "Priya Raman", phone: "9876543210", email: "priya.raman@example.com", loanType: "Home Loan", loanAmount: 4500000, daysAgo: 0 },
  { fullName: "Arjun Mehta", phone: "9123456780", email: "arjun.mehta@example.com", loanType: "Business Loan", loanAmount: 1200000, daysAgo: 0, missing: ["salarySlip", "photo"] },
  { fullName: "Sneha Kulkarni", phone: "9988776655", email: "sneha.kulkarni@example.com", loanType: "Education Loan", loanAmount: 850000, daysAgo: 1 },
  { fullName: "Rahul Verma", phone: "9001122334", email: "rahul.verma@example.com", loanType: "Personal Loan", loanAmount: 300000, daysAgo: 2, missing: ["pan", "bankStatement", "photo"] },
  { fullName: "Fatima Sheikh", phone: "9812345670", email: "fatima.sheikh@example.com", loanType: "Personal Loan", loanAmount: 150000, daysAgo: 3 },
  { fullName: "Karthik Iyer", phone: "9845012345", email: "karthik.iyer@example.com", loanType: "Home Loan", loanAmount: 7800000, daysAgo: 4 },
  { fullName: "Ananya Das", phone: "9830098300", email: "ananya.das@example.com", loanType: "Education Loan", loanAmount: 2200000, daysAgo: 6, missing: ["salarySlip"] },
  { fullName: "Gurpreet Singh", phone: "9814098140", email: "gurpreet.singh@example.com", loanType: "Business Loan", loanAmount: 3500000, daysAgo: 8 },
  { fullName: "Meera Nair", phone: "9447094470", email: "meera.nair@example.com", loanType: "Personal Loan", loanAmount: 500000, daysAgo: 11 },
  { fullName: "Vikram Joshi", phone: "9822098220", email: "vikram.joshi@example.com", loanType: "Other", loanAmount: 250000, daysAgo: 14, missing: ["photo"] },
  { fullName: "Lakshmi Reddy", phone: "9849098490", email: "lakshmi.reddy@example.com", loanType: "Home Loan", loanAmount: 2600000, daysAgo: 18 },
  { fullName: "Imran Khan", phone: "9819098190", email: "imran.khan@example.com", loanType: "Business Loan", loanAmount: 900000, daysAgo: 23, missing: ["aadhaar", "pan", "salarySlip", "bankStatement", "photo"] },
];

// A one-page PDF that says plainly it is a sample.
function samplePdf(lines) {
  const text = lines.map((line, i) => `BT /F1 ${i === 0 ? 22 : 13} Tf 60 ${760 - i * 34} Td (${line.replace(/[()\\]/g, "")}) Tj ET`).join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = objects.map((body, i) => {
    const offset = Buffer.byteLength(pdf);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    return offset;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf);
}

// A plain passport-style silhouette PNG, tinted per applicant.
function samplePhoto(hue) {
  const width = 300, height = 360;
  const [r, g, b] = hslToRgb(hue, 0.45, 0.82);
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    const row = Buffer.alloc(1 + width * 3);
    for (let x = 0; x < width; x += 1) {
      const head = (x - 150) ** 2 + (y - 140) ** 2 < 62 ** 2;
      const body = y > 225 && ((x - 150) / 125) ** 2 + ((y - 380) / 150) ** 2 < 1;
      const shade = head || body ? 0.45 : 1;
      row[1 + x * 3] = r * shade; row[2 + x * 3] = g * shade; row[3 + x * 3] = b * shade;
    }
    rows.push(row);
  }
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const length = Buffer.alloc(4); length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function crc32(buffer) {
  let crc = ~0;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function hslToRgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); };
  return [f(0), f(8), f(4)];
}

function writeSampleFiles(sample, index) {
  const slug = sample.fullName.toLowerCase().replace(/[^a-z]+/g, "-");
  const paths = {};
  for (const key of DOCS) {
    if (sample.missing?.includes(key)) { paths[key] = ""; continue; }
    const name = `sample-${slug}-${key}.${key === "photo" ? "png" : "pdf"}`;
    const content = key === "photo"
      ? samplePhoto((index * 47) % 360)
      : samplePdf([`SAMPLE ${DOC_TITLES[key].toUpperCase()}`, `Applicant: ${sample.fullName}`, `Loan: ${sample.loanType}, Rs ${sample.loanAmount.toLocaleString("en-IN")}`, "This is test data created by npm run seed.", "It is not a real document."]);
    fs.writeFileSync(path.join(uploadDir, name), content);
    paths[key] = `/uploads/${name}`;
  }
  return paths;
}

function removeSampleFiles() {
  for (const file of fs.readdirSync(uploadDir)) {
    if (file.startsWith("sample-")) fs.unlinkSync(path.join(uploadDir, file));
  }
}

async function run() {
  const clearOnly = process.argv.includes("--clear");
  await connectDB();
  fs.mkdirSync(uploadDir, { recursive: true });

  const emails = samples.map((s) => s.email);
  const { deletedCount } = await LoanApplication.deleteMany({ email: { $in: emails } });
  removeSampleFiles();
  console.log(`Removed ${deletedCount} existing sample applications.`);
  if (clearOnly) return;

  const now = Date.now();
  const docs = samples.map((sample, index) => {
    const { daysAgo, missing: _missing, ...fields } = sample;
    // Spread the times through the working day so "Received today" and ordering look natural.
    const createdAt = new Date(now - daysAgo * 86400000 - (index % 5) * 47 * 60000);
    return { ...fields, ...writeSampleFiles(sample, index), createdAt, updatedAt: createdAt, __v: 0 };
  });

  // Insert directly so the chosen createdAt dates are kept.
  await LoanApplication.collection.insertMany(docs);
  console.log(`Added ${docs.length} sample applications. Sign in as the admin and open the dashboard to see them.`);
}

run()
  .catch((error) => {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
